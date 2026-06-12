from fastapi import FastAPI
from sqlalchemy import text
# from app.db import engine
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, stocks, portfolio, news
from app.routes import auth

app = FastAPI(
    title="AlphaEdge AI Server",
    description="GenAI Financial Intelligence API",
    version="1.0.0"
)
# @app.on_event("startup")
# async def startup():
#     try:
#         with engine.connect() as conn:
#             conn.execute(text("SELECT 1"))
#             print("✅ PostgreSQL Connected Successfully")
#     except Exception as e:
#         print("❌ Database Connection Error:", e)

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
app.include_router(auth.router, prefix="/api")