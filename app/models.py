import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    domain = Column(String(100), nullable=True)
    plan = Column(String(50), default="Free")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="company")
    projects = relationship("Project", back_populates="company")
    subscriptions = relationship("Subscription", back_populates="company")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(50), default="Company Member") # Super Admin, Company Admin, Company Member
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="users")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="projects")
    db_configs = relationship("DBConfig", back_populates="project", uselist=False)
    llm_configs = relationship("LLMConfig", back_populates="project", uselist=False)
    api_tokens = relationship("APIToken", back_populates="project")
    query_logs = relationship("QueryLog", back_populates="project")

class DBConfig(Base):
    __tablename__ = "db_configs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, unique=True)
    db_type = Column(String(50), default="sqlite") # sqlite, postgresql, mysql
    host = Column(String(100), nullable=True)
    port = Column(Integer, nullable=True)
    database_name = Column(String(100), nullable=True)
    username = Column(String(100), nullable=True)
    encrypted_password = Column(Text, nullable=True)
    sqlite_file_path = Column(String(255), nullable=True)
    schema_cache = Column(Text, nullable=True) # JSON cache of table structures

    project = relationship("Project", back_populates="db_configs")

class LLMConfig(Base):
    __tablename__ = "llm_configs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, unique=True)
    provider = Column(String(50), default="ollama") # ollama, openai, gemini, anthropic
    model_name = Column(String(100), default="llama3")
    api_key = Column(String(255), nullable=True)
    is_local = Column(Boolean, default=True)

    project = relationship("Project", back_populates="llm_configs")

class APIToken(Base):
    __tablename__ = "api_tokens"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    token_key = Column(String(120), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    rate_limit = Column(Integer, default=1000)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="api_tokens")

class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, nullable=True)
    question = Column(Text, nullable=False)
    generated_sql = Column(Text, nullable=True)
    status = Column(String(50), default="success") # success, error, blocked
    tokens_used = Column(Integer, default=0)
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="query_logs")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    plan = Column(String(50), default="Free") # Free, Starter, Business, Enterprise
    status = Column(String(50), default="active")
    queries_used = Column(Integer, default=0)
    max_queries = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="subscriptions")
