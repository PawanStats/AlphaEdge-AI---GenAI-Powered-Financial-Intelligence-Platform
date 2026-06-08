import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are AlphaEdge AI, an expert
financial assistant specializing in Indian
and global stock markets, investing, mutual
funds, and trading strategies.
Only answer finance-related questions.
Be concise, accurate, and helpful."""

def get_ai_reply(messages: list) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT}
            ] + messages,
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def get_sentiment(text: str) -> str:
    reply = get_ai_reply([{
        "role": "user",
        "content": (
            f"Analyze sentiment of this financial "
            f"headline: '{text}'. Reply with ONLY "
            f"one word: Positive, Neutral, or Negative."
        )
    }])
    return reply.strip()