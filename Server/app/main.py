from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, stocks, portfolio, news

app = FastAPI(
    title="AlphaEdge AI Server",
    description="GenAI Financial Intelligence API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AlphaEdge AI Server is running",
        "status": "ok"
    }

app.include_router(chat.router,      prefix="/api")
app.include_router(stocks.router,    prefix="/api")
app.include_router(portfolio.router, prefix="/api")  # ← add this
app.include_router(news.router,      prefix="/api")