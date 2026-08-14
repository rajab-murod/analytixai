import re
import datetime
import hashlib
import jwt
from typing import Tuple, Optional

SECRET_KEY = "analytix-ai-super-secret-key-for-mvp-tokens"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

# ==================== SQL GUARD & SANITIZER ====================
FORBIDDEN_KEYWORDS = [
    r"\bINSERT\b", r"\bUPDATE\b", r"\bDELETE\b", r"\bDROP\b",
    r"\bALTER\b", r"\bTRUNCATE\b", r"\bCREATE\b", r"\bREPLACE\b",
    r"\bEXEC\b", r"\bEXECUTE\b", r"\bGRANT\b", r"\bREVOKE\b",
    r"\bATTACH\b", r"\bDETACH\b", r"\bPRAGMA\b", r"\bVACUUM\b"
]

def sanitize_and_validate_sql(sql: str) -> Tuple[bool, str]:
    """
    Validates SQL query against SQL injection or dangerous data modification operations.
    Returns (is_valid, cleaned_sql_or_error_msg).
    """
    if not sql or not sql.strip():
        return False, "SQL query is empty"

    cleaned_sql = sql.strip().strip(';').strip()

    # Remove single line comments -- and block comments /* */
    cleaned_no_comments = re.sub(r'--.*$', '', cleaned_sql, flags=re.MULTILINE)
    cleaned_no_comments = re.sub(r'/\*.*?\*/', '', cleaned_no_comments, flags=re.DOTALL)

    upper_sql = cleaned_no_comments.upper()

    # Check for forbidden mutation keywords
    for pattern in FORBIDDEN_KEYWORDS:
        if re.search(pattern, upper_sql):
            keyword = pattern.replace(r"\b", "")
            return False, f"Xavfsizlik qoidasi buzuldi: '{keyword}' operatsiyasiga ruxsat berilmagan (faqat SELECT mumkin)."

    # Must start with SELECT or WITH
    if not (upper_sql.startswith("SELECT") or upper_sql.startswith("WITH")):
        return False, "Faqat ma'lumotlarni o'qish (SELECT) so'rovlariga ruxsat berilgan."

    # Try parsing with sqlparse if installed
    try:
        import sqlparse
        parsed = sqlparse.parse(cleaned_sql)
        for stmt in parsed:
            stmt_type = stmt.get_type()
            if stmt_type and stmt_type != 'SELECT':
                return False, f"Xavfsizlik qoidasi: '{stmt_type}' turidagi so'rovlar bloklangan."
    except ImportError:
        pass

    return True, cleaned_sql
