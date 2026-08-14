import sys
import os
import json

# Add project root to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app.database import engine, Base
from app.sample_db import init_sample_database
from app.query_engine import execute_natural_language_query
from app.security import sanitize_and_validate_sql
from app.excel_exporter import generate_excel_report

print("=== 1. Database & Sample Data Init Test ===")
Base.metadata.create_all(bind=engine)
sample_db_path = init_sample_database()
print(f"Sample DB created/loaded at: {sample_db_path}")

print("\n=== 2. SQL Guard Security Sanitizer Test ===")
valid_query = "SELECT * FROM products WHERE price > 100;"
invalid_query = "DELETE FROM products WHERE product_id = 1;"
drop_query = "DROP TABLE customers;"

is_valid, msg = sanitize_and_validate_sql(valid_query)
print(f"SELECT Query Valid? {is_valid} -> {msg}")
assert is_valid == True, "SELECT query should be valid"

is_valid, msg = sanitize_and_validate_sql(invalid_query)
print(f"DELETE Query Valid? {is_valid} -> {msg}")
assert is_valid == False, "DELETE query must be blocked by SQL Guard"

is_valid, msg = sanitize_and_validate_sql(drop_query)
print(f"DROP Query Valid? {is_valid} -> {msg}")
assert is_valid == False, "DROP query must be blocked by SQL Guard"

print("\n=== 3. Query Engine NL-to-SQL Test ===")
res1 = execute_natural_language_query("Eng ko'p sotilgan 5 ta mahsulotni ko'rsat")
print(f"Question: {res1.get('question')}")
print(f"Generated SQL: {res1.get('generated_sql')}")
print(f"Rows Count: {res1.get('row_count')}")
print(f"Chart Recommended: {res1.get('chart', {}).get('type')}")
assert res1['status'] == 'success', "Query engine must succeed"
assert res1['row_count'] > 0, "Query should return rows"

print("\n=== 4. Excel Exporter Test ===")
excel_stream = generate_excel_report(res1['columns'], res1['rows'], "Test Report")
excel_bytes = excel_stream.getvalue()
print(f"Generated Excel file size: {len(excel_bytes)} bytes")
assert len(excel_bytes) > 0, "Excel output must not be empty"

print("\n[SUCCESS] BARCHA TESTLAR MUVAFFAQIYATLI O'TDI!")
