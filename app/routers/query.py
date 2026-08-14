from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import QueryLog
from app.query_engine import execute_natural_language_query
from app.excel_exporter import generate_excel_report

router = APIRouter(prefix="/api", tags=["Query Engine"])

class QueryRequest(BaseModel):
    question: str
    project_id: Optional[int] = 1

class ExportExcelRequest(BaseModel):
    columns: List[str]
    rows: List[List[Any]]
    title: Optional[str] = "Analytix AI Hisoboti"

@router.post("/query")
def run_query(req: QueryRequest, db: Session = Depends(get_db)):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="So'rov matni kiritilmagan.")

    result = execute_natural_language_query(req.question)

    # Save to query logs
    try:
        log = QueryLog(
            project_id=req.project_id or 1,
            question=req.question,
            generated_sql=result.get("generated_sql"),
            status=result.get("status", "success"),
            tokens_used=len(req.question.split()) * 2,
            execution_time_ms=result.get("execution_time_ms", 0)
        )
        db.add(log)
        db.commit()
    except Exception:
        pass

    return result

@router.post("/reports/export-excel")
def export_excel(req: ExportExcelRequest):
    if not req.columns:
        raise HTTPException(status_code=400, detail="Jadval ustunlari mavjud emas.")

    excel_stream = generate_excel_report(req.columns, req.rows, req.title)
    
    headers = {
        "Content-Disposition": f"attachment; filename=Analytix_Report_{int(req.title != '')}.xlsx"
    }
    return Response(
        content=excel_stream.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers
    )
