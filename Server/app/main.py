from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat

app = FastAPI(
    title="AlphaEdge AI Server",
    description="GenAI Financial Intelligence API",
    version="1.0.0"
)

app.include_router(chat.router, prefix='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return{
        "message": "AlphaEdge AI Server is running",
        "status": "success"
    }