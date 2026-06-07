import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";

// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// AlphaEdge Pages
import Home          from "./pages/Dashboard/Home";
import Chatbot       from "./pages/Dashboard/Chatbot";
import StockAnalysis from "./pages/Dashboard/StockAnalysis";
import Portfolio     from "./pages/Dashboard/Portfolio";
import News          from "./pages/Dashboard/News";
import Calculators   from "./pages/Dashboard/Calculators";
import Learn         from "./pages/Dashboard/Learn";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Auth Routes — no sidebar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Main App Routes — WITH sidebar + header */}
        <Route element={<AppLayout />}>
          <Route index               element={<Home />}          />
          <Route path="/chat"        element={<Chatbot />}       />
          <Route path="/stocks"      element={<StockAnalysis />} />
          <Route path="/portfolio"   element={<Portfolio />}     />
          <Route path="/news"        element={<News />}          />
          <Route path="/calculators" element={<Calculators />}   />
          <Route path="/learn"       element={<Learn />}         />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}