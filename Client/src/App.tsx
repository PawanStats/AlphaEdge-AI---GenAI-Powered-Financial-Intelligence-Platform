import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Chatbot from "./pages/Dashboard/Chatbot";
import StockAnalysis from "./pages/Dashboard/StockAnalysis";
import Portfolio from "./pages/Dashboard/Portfolio";
// AlphaEdge Pages (we will create these one by one)
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Chatbot from "./pages/Chatbot/Chatbot";
// import StockAnalysis from "./pages/StockAnalysis/StockAnalysis";
// import Portfolio from "./pages/Portfolio/Portfolio";
// import News from "./pages/News/News";
// import Calculators from "./pages/Calculators/Calculators";
// import Learn from "./pages/Learn/Learn";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Auth Routes — no sidebar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/stocks" element={<StockAnalysis />} />
        <Route path="/portfolio" element={<Portfolio />} />
        {/* Main App Routes — with sidebar + header */}
        <Route element={<AppLayout />}>

          {/* Placeholder home — replace later */}
          <Route
            index
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Welcome to AlphaEdge AI 🚀
                </h1>
                <p className="mt-2 text-gray-500">
                  Server is connected. Start building pages!
                </p>
              </div>
            }
          />

          {/* Add pages here as we build them */}

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}