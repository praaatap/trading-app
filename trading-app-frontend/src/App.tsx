import { Routes, Route } from "react-router-dom";
import MinimalistStockLandingPage from "./pages/landingPgae";
import SignUpPage from "./pages/createAccountPage";
import NotFoundPage from "./pages/notFoundPage";
import DashboardPage from "./pages/DashboardPage";
import StockDetailPage from "./pages/StockDetailPage";

const AboutPage = () => <h1>About Us</h1>;

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MinimalistStockLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-account" element={<SignUpPage />} />
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/stock/:symbol" element={<StockDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
