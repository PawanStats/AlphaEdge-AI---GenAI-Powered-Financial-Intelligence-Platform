from fastapi import APIRouter
from pydantic import BaseModel
from app.services import openai_service

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    """
    Receives conversation history from React,
    returns AI reply from OpenAI.
    """
    reply = openai_service.get_ai_reply(body.messages)
    return{"reply": reply}