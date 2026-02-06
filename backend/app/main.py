from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.team import router as teams_router
from app.api.task import router as tasks_router
from app.api.admin import router as admin_router
from app.api.user import router as user_router
from app.api.manager import router as manager_router


from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

@app.on_event("startup")
def startup_event():
    logger.info("🚀 Task Management API started")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://6973df73b0eeaee5259f83ed--melodious-gecko-122373.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(teams_router)
app.include_router(tasks_router)
app.include_router(admin_router)
app.include_router(user_router)
app.include_router(manager_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
