from fastapi import APIRouter
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

def clean_text(text: str) -> str:
    """Remove messy characters from text."""
    if not text:
        return ""
    return text.replace("\xa0", " ").replace("\n", " ").strip()

@router.get("/news")
async def get_news():
    try:
        api_key = os.getenv("FINNHUB_KEY")

        if not api_key:
            return {
                "articles": [],
                "total":    0,
                "error":    "FINNHUB_KEY not found in .env"
            }

        url = (f"https://finnhub.io/api/v1/news"
               f"?category=general&token={api_key}")
        response = requests.get(url, timeout=10)
        raw = response.json()

        if not isinstance(raw, list):
            return {
                "articles": [],
                "total":    0,
                "error":    f"Finnhub error: {raw}"
            }

        # Filter only finance/business relevant news
        # and take top 10 only
        articles = []
        for item in raw[:10]:
            headline = clean_text(item.get("headline", ""))
            summary  = clean_text(item.get("summary",  ""))

            # Skip empty headlines
            if not headline:
                continue

            # Convert unix timestamp to readable date
            timestamp = item.get("datetime", 0)
            try:
                date_str = datetime.fromtimestamp(
                    timestamp).strftime("%d %b %Y, %I:%M %p")
            except:
                date_str = ""

            articles.append({
                "id":        item.get("id"),
                "title":     headline,
                "summary":   summary,
                "source":    item.get("source", ""),
                "url":       item.get("url", ""),
                "image":     item.get("image", ""),
                "time":      date_str,
                "category":  item.get("category", "business"),
                "sentiment": "Neutral"
            })

        return {
            "articles": articles,
            "total":    len(articles),
            "error":    None
        }

    except Exception as e:
        return {
            "articles": [],
            "total":    0,
            "error":    f"Could not fetch news: {str(e)}"
        }