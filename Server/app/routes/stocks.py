from fastapi import APIRouter
from app.services import stock_service, openai_service


router = APIRouter()

@router.get("/stock/{ticker}")
async def get_stock(ticker: str):
    """
    Returns real-time stock data + AI anaytics.
    Example: GET /api/stock/RELIANCE
    """
    # step 1: Get real stock data from yfinance
    data = stock_service.get_stock_data(ticker)

    # step 2: If ticker not found, return error
    if data.get("error"):
        return data
    
    # step 3: Build prompt for AI analysis
    prompt = (
        f"Analyze {data['name']} ({ticker}) stock. "
        f"Current Price: ₹{data['price']}, "
        f"P/E Ratio: {data['pe_ratio']}, "
        f"EPS: {data['eps']}, "
        f"52W High: {data['week_52_high']}, "
        f"52W Low: {data['week_52_low']}, "
        f"Sector: {data['sector']}. "
        f"Give a 3-sentence investment insight."
    )

    # step 4: Get AI analysis from OpenAI

    ai_analysis = openai_service.get_ai_reply([
        {"role": "user", "content": prompt}
    ])

    # step 5: Combine data and analysis in response
    data["ai_analysis"] = ai_analysis

    return data