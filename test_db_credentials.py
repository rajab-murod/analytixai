import sys
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=== 1. Create Project with Postgres DB Credentials ===")
resp = client.post("/api/projects/", json={
    "company_id": 1,
    "name": "Toshkent Sotuvlar DB",
    "description": "Enterprise PostgreSQL database",
    "db_type": "postgresql",
    "db_host": "db.toshkent.uz",
    "db_port": 5432,
    "db_name": "sales_2026",
    "db_user": "read_only_analyst",
    "db_password": "super_secret_password_123",
    "llm_provider": "ollama"
})
assert resp.status_code == 200, f"Post failed: {resp.text}"
data = resp.json()
p_id = data["id"]
print(f"Project Created: ID #{p_id}, Host: {data.get('db_host')}, User: {data.get('db_user')}")
assert data["db_host"] == "db.toshkent.uz"
assert data["db_user"] == "read_only_analyst"

print("\n=== 2. Update Project DB Credentials ===")
upd_resp = client.put(f"/api/projects/{p_id}", json={
    "company_id": 1,
    "name": "Toshkent Sotuvlar DB (Updated)",
    "db_type": "mysql",
    "db_host": "mysql.toshkent.uz",
    "db_port": 3306,
    "db_name": "sales_mysql",
    "db_user": "mysql_read_user",
    "db_password": "new_mysql_password_456",
    "llm_provider": "openai"
})
assert upd_resp.status_code == 200, f"Update failed: {upd_resp.text}"
upd_data = upd_resp.json()
print(f"Project Updated: Host: {upd_data.get('db_host')}, Port: {upd_data.get('db_port')}, DB: {upd_data.get('db_name')}, User: {upd_data.get('db_user')}")
assert upd_data["db_host"] == "mysql.toshkent.uz"
assert upd_data["db_port"] == 3306
assert upd_data["db_user"] == "mysql_read_user"

# Clean up
client.delete(f"/api/projects/{p_id}?company_id=1")

print("\n[SUCCESS] BAZA ULANISH PAROMETRLARI (HOST, LOGIN, PAROL) TESTLARI O'TDI!")
