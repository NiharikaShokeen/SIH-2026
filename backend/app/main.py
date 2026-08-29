import sys
import os


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API for AI-Based Real-Time Stress and Trauma Assessment Module (NHAA 14566 & Integrated Portal)"
)

# CORS configuration for local dev and frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "title": settings.APP_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_health": f"{settings.API_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
