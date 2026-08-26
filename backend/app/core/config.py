from pydantic import BaseModel

class AppSettings(BaseModel):
    APP_NAME: str = "NHAA 14566 AI Stress & Trauma Assessment Module"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
settings = AppSettings()
