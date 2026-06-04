from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services import stock_service

router = APIRouter()

class Holding(BaseModel):
    ticker: str
    quantity: float
    buy_price: float

class PortfolioRequest(BaseModel):
    holdings: List[Holding]

@router.post("/portfolio/analyze")
async def analyze_portfolio(body: PortfolioRequest):
    results = []
    total_invested = 0
    total_current  = 0

    for h in body.holdings:
        current_price = stock_service.get_price(h.ticker)
        invested      = h.buy_price * h.quantity
        current_value = current_price * h.quantity
        gain_loss     = current_value - invested
        gain_pct      = ((gain_loss / invested) * 100
                        if invested > 0 else 0)

        results.append({
            "ticker":        h.ticker.upper(),
            "quantity":      h.quantity,
            "buy_price":     h.buy_price,
            "current_price": current_price,
            "invested":      round(invested, 2),
            "current_value": round(current_value, 2),
            "gain_loss":     round(gain_loss, 2),
            "gain_pct":      round(gain_pct, 2)
        })

        total_invested += invested
        total_current  += current_value

    total_gain     = total_current - total_invested
    total_gain_pct = ((total_gain / total_invested) * 100
                     if total_invested > 0 else 0)

    return {
        "holdings":       results,
        "total_invested": round(total_invested, 2),
        "total_current":  round(total_current, 2),
        "total_gain":     round(total_gain, 2),
        "total_gain_pct": round(total_gain_pct, 2),
        "ai_suggestion":  "AI rebalancing coming soon."
    }