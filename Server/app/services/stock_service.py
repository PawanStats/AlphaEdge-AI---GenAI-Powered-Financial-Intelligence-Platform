import yfinance as yf
import math

def clean(val):
    try:
        if val is None:
            return None
        if math.isnan(float(val)):
            return None
        return val
    except:
        return None

def get_stock_data(ticker: str) -> dict:
    try:
        symbol = f"{ticker.upper()}.NS"
        stock = yf.Ticker(symbol)
        
        hist = yf.download(symbol, period="1mo", 
                          progress=False, auto_adjust=True)
        
        if hist.empty:
            symbol = f"{ticker.upper()}.BO"
            stock  = yf.Ticker(symbol)
            hist   = yf.download(symbol, period="1mo",
                                 progress=False, auto_adjust=True)
        
        if hist.empty:
            return {
                "ticker": ticker.upper(),
                "error": f"No data found for '{ticker}'"
            }

        # Safe price extraction
        # Get last non-NaN closing price
        close_series = hist["Close"].squeeze().dropna()

        if close_series.empty:
            return {
                "ticker": ticker.upper(),
                "error":  "Price data unavailable"
        }

        price      = round(float(close_series.iloc[-1]), 2)
        prev_close = round(float(close_series.iloc[-2]), 2) \
             if len(close_series) > 1 else price

        # Build history array for chart
        history = []
        for idx, row in hist.iterrows():
            try:
                val = row["Close"]
                if hasattr(val, 'iloc'):
                    val = float(val.iloc[0])
                else:
                    val = float(val)
                if not math.isnan(val):
                    history.append({
                        "date":  str(idx.date()),
                        "price": round(val, 2)
                    })
            except:
                continue

        # Get fundamentals separately
        try:
            info       = stock.info
            pe_ratio   = clean(info.get("trailingPE"))
            eps        = clean(info.get("trailingEps"))
            market_cap = clean(info.get("marketCap"))
            high_52w   = clean(info.get("fiftyTwoWeekHigh"))
            low_52w    = clean(info.get("fiftyTwoWeekLow"))
            volume     = clean(info.get("volume"))
            sector     = info.get("sector") or "N/A"
            name       = info.get("longName") or ticker
        except:
            pe_ratio = eps = market_cap = None
            high_52w = low_52w = volume = None
            sector   = "N/A"
            name     = ticker

        return {
            "ticker":       ticker.upper(),
            "symbol":       symbol,
            "name":         name,
            "price":        price,
            "prev_close":   prev_close,
            "pe_ratio":     pe_ratio,
            "eps":          eps,
            "market_cap":   market_cap,
            "week_52_high": high_52w,
            "week_52_low":  low_52w,
            "volume":       volume,
            "sector":       sector,
            "history":      history,
            "error":        None
        }

    except Exception as e:
        return {
            "ticker": ticker.upper(),
            "error":  f"Could not fetch data: {str(e)}"
        }


def get_price(ticker: str) -> float:
    """Quick price lookup for portfolio."""
    try:
        symbol = f"{ticker.upper()}.NS"
        hist   = yf.download(symbol, period="5d",
                             progress=False, auto_adjust=True)
        if hist.empty:
            return 0.0
        return round(float(hist["Close"].iloc[-1].iloc[0]), 2)
    except:
        return 0.0