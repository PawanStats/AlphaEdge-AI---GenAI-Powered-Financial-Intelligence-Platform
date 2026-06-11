# AlphaEdge AI — GenAI-Powered Financial Intelligence Platform

![AlphaEdge AI](https://img.shields.io/badge/AlphaEdge-AI-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.13-yellow?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

> An AI-powered financial assistant that simplifies investing, stock analysis, and financial learning through natural language conversations.

---

## 📌 Project Overview

AlphaEdge AI is a full-stack GenAI-powered financial intelligence platform that combines:
- **Generative AI** (Groq LLaMA 3) for intelligent financial conversations
- **Real-time Market Data** (yfinance / NSE / BSE) for live stock prices
- **Financial Analytics** for portfolio P&L and risk analysis
- **News Sentiment Analysis** via Finnhub API

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 AI Financial Chatbot | Ask anything about stocks, SIP, mutual funds, trading |
| 📈 Stock Analysis | Real-time NSE/BSE data with AI investment insights |
| 💼 Portfolio Analyzer | Track holdings, P&L, gain/loss per stock |
| 📰 Financial News | Live headlines with sentiment badges |
| 🧮 Financial Calculators | SIP, EMI, Compound Interest, Retirement planner |
| 📚 Learning Roadmap | AI-curated curriculum for investors |

---

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** + TypeScript
- **Tailwind CSS** (TailAdmin template)
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation

### Backend (Server)
- **Python 3.13** + **FastAPI**
- **Groq API** (LLaMA 3 70B) for AI responses
- **yfinance** for real-time NSE/BSE stock data
- **Finnhub API** for financial news
- **LangChain** + **ChromaDB** for RAG pipeline
- **Uvicorn** as ASGI server

---

## 📁 Project Structure

```
AlphaEdge AI/
├── Client/                      # React frontend
│   └── src/
│       ├── pages/
│       │   └── Dashboard/
│       │       ├── Home.tsx         # Dashboard
│       │       ├── Chatbot.tsx      # AI Chatbot
│       │       ├── StockAnalysis.tsx
│       │       ├── Portfolio.tsx
│       │       ├── News.tsx
│       │       ├── Calculators.tsx
│       │       └── Learn.tsx
│       ├── api/
│       │   └── axiosInstance.ts     # API connector
│       ├── layout/
│       │   ├── AppLayout.tsx
│       │   ├── AppSidebar.tsx
│       │   └── AppHeader.tsx
│       └── App.tsx
│
└── Server/                      # FastAPI backend
    └── app/
        ├── routes/
        │   ├── chat.py              # POST /api/chat
        │   ├── stocks.py            # GET /api/stock/{ticker}
        │   ├── portfolio.py         # POST /api/portfolio/analyze
        │   └── news.py              # GET /api/news
        ├── services/
        │   ├── openai_service.py    # Groq AI integration
        │   ├── stock_service.py     # yfinance data
        │   └── rag_service.py       # RAG pipeline
        └── main.py                  # FastAPI app entry
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/alphaedge-ai.git
cd alphaedge-ai
```

### 2. Setup Server
```bash
cd Server

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env
```

### 3. Configure Environment Variables

Create `Server/.env`:
```env
GROQ_API_KEY=gsk_your-groq-key-here
FINNHUB_KEY=your-finnhub-key-here
ALPHA_VANTAGE_KEY=your-alphavantage-key-here
```

### 4. Run the Server
```bash
cd Server
uvicorn app.main:app --reload --port 8000
```
Server runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 5. Setup Client
```bash
cd Client
npm install
npm run dev
```
Client runs at: `http://localhost:5173`

---

## 🔑 API Keys Required

| Service | Purpose | Free Tier | Get Key |
|---|---|---|---|
| Groq | AI chatbot (LLaMA 3) | ✅ Free | [console.groq.com](https://console.groq.com) |
| Finnhub | Financial news | ✅ Free | [finnhub.io](https://finnhub.io) |
| Alpha Vantage | Market data | ✅ Free | [alphavantage.co](https://www.alphavantage.co) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI chatbot response |
| GET | `/api/stock/{ticker}` | Real-time stock data + AI analysis |
| POST | `/api/portfolio/analyze` | Portfolio P&L analysis |
| GET | `/api/news` | Latest financial news + sentiment |

### Example Request — Chat
```json
POST /api/chat
{
  "messages": [
    {"role": "user", "content": "What is a P/E ratio?"}
  ]
}
```

### Example Request — Stock
```
GET /api/stock/RELIANCE
```

### Example Request — Portfolio
```json
POST /api/portfolio/analyze
{
  "holdings": [
    {"ticker": "TCS", "quantity": 10, "buy_price": 3500},
    {"ticker": "RELIANCE", "quantity": 5, "buy_price": 1200}
  ]
}
```

---

## 🌐 Deployment

### Server → Render.com
1. Push Server folder to GitHub
2. Create new Web Service on Render
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

### Client → Vercel.com
1. Push Client folder to GitHub
2. Import project on Vercel
3. Framework: Vite
4. Add environment variable: `VITE_API_URL=https://your-server.onrender.com/api`
5. Deploy

---

## 📸 Screenshots

| Dashboard | Stock Analysis |
|---|---|
| Live watchlist + chart + news | Real-time NSE data + AI insights |

| Portfolio Analyzer | AI Chatbot |
|---|---|
| Holdings P&L breakdown | Groq LLaMA 3 powered |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**AlphaEdge AI** — Built with ❤️ using React, FastAPI, and Groq AI

---

## 🙏 Acknowledgements

- [TailAdmin](https://tailadmin.com) — React dashboard template
- [Groq](https://groq.com) — Ultra-fast LLaMA 3 inference
- [yfinance](https://github.com/ranaroussi/yfinance) — Yahoo Finance market data
- [Finnhub](https://finnhub.io) — Financial news API
- [FastAPI](https://fastapi.tiangolo.com) — Modern Python web framework