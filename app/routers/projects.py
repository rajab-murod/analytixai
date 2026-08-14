import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, DBConfig, LLMConfig, APIToken, QueryLog, Company
from app.security import hash_password

router = APIRouter(prefix="/api/projects", tags=["Projects"])

class CreateProjectRequest(BaseModel):
    company_id: int = 1
    name: str
    description: Optional[str] = None
    db_type: str = "sqlite" # sqlite, postgresql, mysql
    db_host: Optional[str] = "localhost"
    db_port: Optional[int] = 5432
    db_name: Optional[str] = "analytics_db"
    db_user: Optional[str] = "read_only_user"
    db_password: Optional[str] = None
    llm_provider: str = "ollama" # ollama, openai, gemini

class UpdateProjectRequest(BaseModel):
    company_id: int = 1
    name: Optional[str] = None
    description: Optional[str] = None
    db_type: Optional[str] = None
    db_host: Optional[str] = None
    db_port: Optional[int] = None
    db_name: Optional[str] = None
    db_user: Optional[str] = None
    db_password: Optional[str] = None
    llm_provider: Optional[str] = None

@router.get("/")
def list_projects(company_id: int = 1, db: Session = Depends(get_db)):
    """Lists projects belonging STRICTLY to the requested company_id (Tenant Isolation)."""
    projects = db.query(Project).filter(Project.company_id == company_id).all()
    result = []
    for p in projects:
        db_cfg = db.query(DBConfig).filter(DBConfig.project_id == p.id).first()
        llm_cfg = db.query(LLMConfig).filter(LLMConfig.project_id == p.id).first()
        result.append({
            "id": p.id,
            "company_id": p.company_id,
            "name": p.name,
            "description": p.description,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "db_type": db_cfg.db_type if db_cfg else "sqlite",
            "db_host": db_cfg.host if db_cfg else "localhost",
            "db_port": db_cfg.port if db_cfg else 5432,
            "db_name": db_cfg.database_name if db_cfg else "analytics_db",
            "db_user": db_cfg.username if db_cfg else "read_user",
            "llm_provider": llm_cfg.provider if llm_cfg else "ollama"
        })
    return result

@router.post("/")
def create_project(req: CreateProjectRequest, db: Session = Depends(get_db)):
    """Creates a new project for the specific company_id with DB credentials."""
    company = db.query(Company).filter(Company.id == req.company_id).first()
    if not company:
        company = Company(id=req.company_id, name="Demo Company", plan="Free")
        db.add(company)
        db.commit()
        db.refresh(company)

    project = Project(company_id=req.company_id, name=req.name, description=req.description)
    db.add(project)
    db.commit()
    db.refresh(project)

    # DB Config with credentials
    encrypted_pwd = hash_password(req.db_password) if req.db_password else None
    db_cfg = DBConfig(
        project_id=project.id,
        db_type=req.db_type,
        host=req.db_host,
        port=req.db_port or (3306 if req.db_type == 'mysql' else 5432),
        database_name=req.db_name,
        username=req.db_user,
        encrypted_password=encrypted_pwd
    )
    db.add(db_cfg)

    # LLM Config
    llm_cfg = LLMConfig(project_id=project.id, provider=req.llm_provider, is_local=(req.llm_provider == "ollama"))
    db.add(llm_cfg)

    # API Token
    token_str = f"aai_{uuid.uuid4().hex}"
    api_token = APIToken(project_id=project.id, token_key=token_str, name="Default API Key")
    db.add(api_token)

    db.commit()

    return {
        "id": project.id,
        "company_id": project.company_id,
        "name": project.name,
        "api_token": token_str,
        "db_type": req.db_type,
        "db_host": req.db_host,
        "db_user": req.db_user,
        "message": "Loyiha va Baza ma'lumotlari muvaffaqiyatli saqlandi"
    }

@router.put("/{project_id}")
def update_project(project_id: int, req: UpdateProjectRequest, db: Session = Depends(get_db)):
    """Updates a project and its database credentials."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Loyiha topilmadi")

    # Multi-tenant check
    if project.company_id != req.company_id:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan: Siz faqat o'zingizning loyihalaringizni tahrirlashingiz mumkin")

    if req.name is not None:
        project.name = req.name
    if req.description is not None:
        project.description = req.description

    # Update DB Config
    db_cfg = db.query(DBConfig).filter(DBConfig.project_id == project.id).first()
    if not db_cfg:
        db_cfg = DBConfig(project_id=project.id)
        db.add(db_cfg)

    if req.db_type is not None:
        db_cfg.db_type = req.db_type
    if req.db_host is not None:
        db_cfg.host = req.db_host
    if req.db_port is not None:
        db_cfg.port = req.db_port
    if req.db_name is not None:
        db_cfg.database_name = req.db_name
    if req.db_user is not None:
        db_cfg.username = req.db_user
    if req.db_password is not None and req.db_password.strip():
        db_cfg.encrypted_password = hash_password(req.db_password)

    # Update LLM Config
    if req.llm_provider is not None:
        llm_cfg = db.query(LLMConfig).filter(LLMConfig.project_id == project.id).first()
        if not llm_cfg:
            llm_cfg = LLMConfig(project_id=project.id, provider=req.llm_provider, is_local=(req.llm_provider == "ollama"))
            db.add(llm_cfg)
        else:
            llm_cfg.provider = req.llm_provider
            llm_cfg.is_local = (req.llm_provider == "ollama")

    db.commit()

    db_cfg = db.query(DBConfig).filter(DBConfig.project_id == project.id).first()
    llm_cfg = db.query(LLMConfig).filter(LLMConfig.project_id == project.id).first()

    return {
        "id": project.id,
        "company_id": project.company_id,
        "name": project.name,
        "description": project.description,
        "db_type": db_cfg.db_type if db_cfg else "sqlite",
        "db_host": db_cfg.host if db_cfg else "localhost",
        "db_port": db_cfg.port if db_cfg else 5432,
        "db_name": db_cfg.database_name if db_cfg else "analytics_db",
        "db_user": db_cfg.username if db_cfg else "read_user",
        "llm_provider": llm_cfg.provider if llm_cfg else "ollama",
        "message": "Loyiha va Baza ulanish ma'lumotlari muvaffaqiyatli yangilandi"
    }

@router.delete("/{project_id}")
def delete_project(project_id: int, company_id: int = Query(1), db: Session = Depends(get_db)):
    """Deletes a project and its associated configs/tokens. Enforces tenant ownership."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Loyiha topilmadi")

    # Multi-tenant check
    if project.company_id != company_id:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan: Siz faqat o'zingizning loyihalaringizni o'chirishingiz mumkin")

    # Delete related entities
    db.query(DBConfig).filter(DBConfig.project_id == project.id).delete()
    db.query(LLMConfig).filter(LLMConfig.project_id == project.id).delete()
    db.query(APIToken).filter(APIToken.project_id == project.id).delete()
    db.query(QueryLog).filter(QueryLog.project_id == project.id).delete()

    # Delete project
    db.delete(project)
    db.commit()

    return {"message": "Loyiha muvaffaqiyatli o'chirildi", "deleted_id": project_id}
