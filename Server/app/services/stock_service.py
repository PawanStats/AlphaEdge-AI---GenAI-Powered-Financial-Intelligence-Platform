import yfinance as yf

def get_stock_data(ticker: str) -> dict:
    try:
        symbol = f"{ticker.upper()}.NS"
        stock = yf.Ticker(symbol)
        
        # Use download instead of .info — more reliable on Windows
        hist = yf.download(symbol, period="1mo", 
                          progress=False, auto_adjust=True)
        
        if hist.empty:
            # Try BSE
            symbol = f"{ticker.upper()}.BO"
            hist = yf.download(symbol, period="1mo",
                              progress=False, auto_adjust=True)
        
        if hist.empty:
            return {
                "ticker": ticker.upper(),
                "error": f"No data found for '{ticker}'"
            }

        # Get price from history (last closing price)
        price = round(float(hist["Close"].iloc[-1].iloc[0]), 2)
        prev_close = round(float(hist["Close"].iloc[-2].iloc[0]), 2) if len(hist) > 1 else price
        # Build history array for chart
        history = [
            {
                "date": str(idx.date()),
                "price": round(float(row["Close"]), 2)
            }
            for idx, row in hist.iterrows()
        ]

        # Get fundamentals separately
        try:
            info = stock.info
            pe_ratio    = info.get("trailingPE")
            eps         = info.get("trailingEps")
            market_cap  = info.get("marketCap")
            high_52w    = info.get("fiftyTwoWeekHigh")
            low_52w     = info.get("fiftyTwoWeekLow")
            volume      = info.get("volume")
            sector      = info.get("sector")
            name        = info.get("longName", ticker)
        except:
            pe_ratio = eps = market_cap = None
            high_52w = low_52w = volume = sector = None
            name = ticker

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
        hist = yf.download(symbol, period="5d",
                          progress=False, auto_adjust=True)
        if hist.empty:
            return 0.0
        return round(float(hist["Close"].iloc[-1]), 2)
    except:
        return 0.0