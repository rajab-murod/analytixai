from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Company, User, Subscription
from app.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    company_name: str
    full_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Ushbu email bilan foydalanuvchi allaqachon mavjud.")

    # Create Company
    company = Company(name=req.company_name, plan="Free")
    db.add(company)
    db.commit()
    db.refresh(company)

    # Create Admin User
    user = User(
        company_id=company.id,
        email=req.email,
        password_hash=hash_password(req.password),
        full_name=req.full_name,
        role="Company Admin"
    )
    db.add(user)

    # Create Free Subscription
    subscription = Subscription(company_id=company.id, plan="Free", max_queries=50)
    db.add(subscription)

    db.commit()
    db.refresh(user)

    access_token = create_access_token({"sub": user.email, "company_id": company.id, "role": user.role})
    return {
        "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "company_name": company.name
        }
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri.")

    company = db.query(Company).filter(Company.id == user.company_id).first()
    access_token = create_access_token({"sub": user.email, "company_id": user.company_id, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "company_name": company.name if company else "Analytix"
        }
    }
