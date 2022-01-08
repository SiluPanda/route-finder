import fastapi
from uvicorn.config import LOG_LEVELS
from direction import router
import uvicorn
import os

app = fastapi.FastAPI(title="directionAPI")

app.include_router(router.router, prefix="")


@app.get('/ping')
def ping():
    return "server is healthy"
