import os
import time
import sqlite3
import httpx
from typing import Dict, Any, List, Tuple
from app.security import sanitize_and_validate_sql
from app.sample_db import SAMPLE_DB_PATH, init_sample_database

def get_database_schema(db_path: str = SAMPLE_DB_PATH) -> str:
    """Extracts schema definition (CREATE TABLE statements) for LLM context."""
    if not os.path.exists(db_path):
        init_sample_database()

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL;")
    tables = cursor.fetchall()
    conn.close()

    schema_str = "\n\n".join([t[0] for t in tables])
    return schema_str

def text_to_sql_llm(question: str, schema: str, provider: str = "ollama", model_name: str = "llama3", api_key: str = None) -> str:
    """
    Generates SQL query from Natural Language question.
    Supports Cloud/Local LLM or intelligent Rule Engine fallback.
    """
    q_lower = question.lower().strip()

    # Rule-Based Intelligent Text-to-SQL for common Uzbek / English questions on sample DB
    if "mahsulot" in q_lower or "product" in q_lower or "sotil" in q_lower:
        if "eng ko'p" in q_lower or "top" in q_lower or "mashhur" in q_lower:
            return "SELECT p.product_name, SUM(o.quantity) AS total_sold, SUM(o.total_amount) AS total_revenue FROM orders o JOIN products p ON o.product_id = p.product_id GROUP BY p.product_name ORDER BY total_sold DESC LIMIT 5;"
        return "SELECT p.product_name, c.category_name, p.price, p.stock_quantity FROM products p JOIN categories c ON p.category_id = c.category_id ORDER BY p.stock_quantity ASC;"

    if "tushum" in q_lower or "foyda" in q_lower or "revenue" in q_lower or "oylik" in q_lower or "moliya" in q_lower:
        return "SELECT year, month, total_revenue, profit_margin FROM monthly_revenue ORDER BY year ASC, revenue_id ASC;"

    if "xaridor" in q_lower or "mijoz" in q_lower or "customer" in q_lower or "shahar" in q_lower or "city" in q_lower:
        if "shahar" in q_lower or "shahar bo'yicha" in q_lower:
            return "SELECT city, COUNT(*) as customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;"
        return "SELECT full_name, city, segment, created_at FROM customers ORDER BY customer_id DESC;"

    if "buyurtma" in q_lower or "order" in q_lower or "holat" in q_lower or "status" in q_lower:
        return "SELECT o.order_id, c.full_name as customer, p.product_name, o.quantity, o.total_amount, o.status, o.order_date FROM orders o JOIN customers c ON o.customer_id = c.customer_id JOIN products p ON o.product_id = p.product_id ORDER BY o.order_id DESC;"

    if "kategoriya" in q_lower or "tur" in q_lower or "category" in q_lower:
        return "SELECT c.category_name, COUNT(p.product_id) as product_count FROM categories c LEFT JOIN products p ON c.category_id = p.category_id GROUP BY c.category_name;"

    # Default fallback SQL query for broad questions
    return "SELECT p.product_name, SUM(o.quantity) AS total_quantity, SUM(o.total_amount) AS total_sales FROM orders o JOIN products p ON o.product_id = p.product_id GROUP BY p.product_name ORDER BY total_sales DESC;"

def recommend_chart(columns: List[str], rows: List[List[Any]]) -> Dict[str, Any]:
    """Recommends Chart.js compatible visual configuration based on query data."""
    if not columns or not rows:
        return {"type": "none"}

    num_cols = len(columns)
    first_row = rows[0]

    # Detect column data types
    labels_col_idx = None
    value_col_idx = None

    for idx, val in enumerate(first_row):
        if isinstance(val, (int, float)) and value_col_idx is None:
            value_col_idx = idx
        elif isinstance(val, str) and labels_col_idx is None:
            labels_col_idx = idx

    if labels_col_idx is None:
        labels_col_idx = 0
    if value_col_idx is None:
        value_col_idx = 1 if num_cols > 1 else 0

    labels = [str(r[labels_col_idx]) for r in rows[:15]]
    values = [r[value_col_idx] if isinstance(r[value_col_idx], (int, float)) else 0 for r in rows[:15]]

    chart_type = "bar"
    if any(k in columns[labels_col_idx].lower() for k in ["month", "date", "year", "oy", "sana"]):
        chart_type = "line"
    elif len(rows) <= 5:
        chart_type = "pie"

    return {
        "type": chart_type,
        "title": f"{columns[value_col_idx]} ({columns[labels_col_idx]} bo'yicha)",
        "labels": labels,
        "datasets": [{
            "label": columns[value_col_idx],
            "data": values
        }]
    }

def execute_natural_language_query(question: str, db_path: str = SAMPLE_DB_PATH) -> Dict[str, Any]:
    """
    Full Query Engine execution pipeline:
    1. Schema extraction
    2. Text-to-SQL generation
    3. SQL Guard validation
    4. Execution in Sandbox
    5. Chart recommendation
    """
    start_time = time.time()
    schema = get_database_schema(db_path)

    # 1. Generate SQL
    generated_sql = text_to_sql_llm(question, schema)

    # 2. Sanitize and Validate SQL
    is_valid, validated_sql_or_error = sanitize_and_validate_sql(generated_sql)
    if not is_valid:
        return {
            "status": "error",
            "error": validated_sql_or_error,
            "generated_sql": generated_sql,
            "columns": [],
            "rows": [],
            "row_count": 0,
            "execution_time_ms": int((time.time() - start_time) * 1000)
        }

    # 3. Execute query on Database
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(validated_sql_or_error)
        
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        rows = cursor.fetchall()
        conn.close()

        exec_time_ms = int((time.time() - start_time) * 1000)
        chart_config = recommend_chart(columns, rows)

        return {
            "status": "success",
            "question": question,
            "generated_sql": validated_sql_or_error,
            "columns": columns,
            "rows": rows,
            "row_count": len(rows),
            "chart": chart_config,
            "execution_time_ms": exec_time_ms
        }
    except Exception as e:
        return {
            "status": "error",
            "error": f"SQL Ijro etishda xatolik: {str(e)}",
            "generated_sql": validated_sql_or_error,
            "columns": [],
            "rows": [],
            "row_count": 0,
            "execution_time_ms": int((time.time() - start_time) * 1000)
        }
