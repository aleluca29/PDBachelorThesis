import logging
from fastapi import FastAPI
from api.pdRoutes import router as pd_router
from api.userRoutes import router as user_router
from utils.dbConnection import init_db

app = FastAPI()

init_db()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app.include_router(user_router, prefix="/user", tags=["Users"])
app.include_router(pd_router, prefix="/pd", tags=["PD"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the App API"}
