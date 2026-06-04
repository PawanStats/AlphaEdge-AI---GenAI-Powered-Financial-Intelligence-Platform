import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are AlphaEdge AI, an expert
financial assistant specializing in Indian
and global stock markets, investing, mutual
funds, and trading strategies.
Only answer finance-related questions.
Be concise, accurate, and helpful."""

def get_ai_reply(messages: list) -> str:
    """Takes conversation history, returns AI reply."""
    try:
        # Build the prompt from message history
        full_prompt = SYSTEM_PROMPT + "\n\n"
        for msg in messages:
            role = "User" if msg["role"] == "user" else "Assistant"
            full_prompt += f"{role}: {msg['content']}\n"
        full_prompt += "Assistant:"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=full_prompt
        )
        return response.text

    except Exception as e:
        return f"AI Error: {str(e)}"

def get_sentiment(text: str) -> str:
    """Returns Positive, Neutral, or Negative."""
    reply = get_ai_reply([{
        "role": "user",
        "content": (
            f"Analyze sentiment of this financial "
            f"headline: '{text}'. Reply with ONLY "
            f"one word: Positive, Neutral, or Negative."
        )
    }])
    return reply.strip()