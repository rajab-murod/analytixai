import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import engine, Base
from app.sample_db import init_sample_database
from app.routers import auth, projects, query

# Create DB tables
Base.metadata.create_all(bind=engine)

# Initialize sample DB for instant demo
init_sample_database()

app = FastAPI(
    title="Analytix AI MVP API",
    description="Multi-tenant Text-to-SQL Analytics Platform API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(query.router)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

@app.get("/health")
def health_check():
    return {"status": "ok", "platform": "Analytix AI", "version": "v1.0"}

# Serve logo.png
@app.get("/logo.png")
def get_logo():
    logo_path = os.path.join(BASE_DIR, "logo.png")
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    return {"error": "Logo not found"}

# Serve compiled React Dashboard on /dashboard
@app.get("/dashboard")
def get_dashboard():
    dist_index = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index, media_type="text/html")
    return {"error": "Dashboard dist/index.html not built yet"}

# Serve index.html as landing page
@app.get("/")
def get_homepage():
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"error": "index.html not found"}

# Mount frontend assets if available
if os.path.exists(os.path.join(FRONTEND_DIST, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="frontend_assets")

app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
