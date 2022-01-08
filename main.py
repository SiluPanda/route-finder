import fastapi
from direction import router

app = fastapi.FastAPI(title="directionAPI")

app.include_router(router.router, prefix="")


@app.get('/ping')
def ping():
    return "server is healthy"
