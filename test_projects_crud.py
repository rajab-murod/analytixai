import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=== 1. Create Project for Tenant 1 & Tenant 2 ===")
p1_resp = client.post("/api/projects/", json={
    "company_id": 1,
    "name": "Alpha Financial DB",
    "description": "Company 1 Finance Database",
    "db_type": "postgresql",
    "llm_provider": "ollama"
})
assert p1_resp.status_code == 200, f"Failed creating p1: {p1_resp.text}"
p1_data = p1_resp.json()
p1_id = p1_data["id"]
print(f"Company 1 Project Created: ID #{p1_id} -> {p1_data['name']}")

p2_resp = client.post("/api/projects/", json={
    "company_id": 2,
    "name": "Beta Medical Records",
    "description": "Company 2 Patient Records DB",
    "db_type": "mysql",
    "llm_provider": "openai"
})
assert p2_resp.status_code == 200
p2_data = p2_resp.json()
p2_id = p2_data["id"]
print(f"Company 2 Project Created: ID #{p2_id} -> {p2_data['name']}")

print("\n=== 2. Test Tenant Isolation in Listing ===")
list1 = client.get(f"/api/projects/?company_id=1").json()
list1_ids = [p["id"] for p in list1]
print(f"Company 1 Projects: {list1_ids}")
assert p1_id in list1_ids, "Company 1 project should be in list 1"
assert p2_id not in list1_ids, "Company 2 project MUST NOT be visible to Company 1!"

print("\n=== 3. Test Project Update by Owner ===")
update_resp = client.put(f"/api/projects/{p1_id}", json={
    "company_id": 1,
    "name": "Alpha Financial DB (Updated)",
    "db_type": "sqlite",
    "llm_provider": "gemini"
})
assert update_resp.status_code == 200
updated_p1 = update_resp.json()
print(f"Updated Project Name: {updated_p1['name']}, DB: {updated_p1['db_type']}, LLM: {updated_p1['llm_provider']}")
assert updated_p1["name"] == "Alpha Financial DB (Updated)"

print("\n=== 4. Test Cross-Tenant Unauthorized Update Attempt ===")
unauth_update = client.put(f"/api/projects/{p1_id}", json={
    "company_id": 2, # Unauthorized attempt by Company 2
    "name": "Hacked Name"
})
print(f"Cross-Tenant Update HTTP Code: {unauth_update.status_code} -> {unauth_update.json().get('detail')}")
assert unauth_update.status_code == 403, "Must reject cross-tenant update with 403 Forbidden"

print("\n=== 5. Test Cross-Tenant Unauthorized Delete Attempt ===")
unauth_delete = client.delete(f"/api/projects/{p1_id}?company_id=2")
print(f"Cross-Tenant Delete HTTP Code: {unauth_delete.status_code} -> {unauth_delete.json().get('detail')}")
assert unauth_delete.status_code == 403, "Must reject cross-tenant delete with 403 Forbidden"

print("\n=== 6. Test Authorized Project Deletion ===")
del_resp = client.delete(f"/api/projects/{p1_id}?company_id=1")
assert del_resp.status_code == 200
print(f"Delete Result: {del_resp.json()}")

# Clean up p2
client.delete(f"/api/projects/{p2_id}?company_id=2")

print("\n[SUCCESS] BARCHA PROJECTS CRUD VA TENANT ISOLATION TESTLARI O'TDI!")
