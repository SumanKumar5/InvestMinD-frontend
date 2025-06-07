import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AssetTable from "./components/AssetTable";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import Portfolio from "./components/Portfolio";
import PortfolioDetails from "./components/PortfolioDetails";
import HoldingTransactions from "./components/HoldingTransactions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route
              path="/portfolio/:portfolioId"
              element={<PortfolioDetails />}
            />
            <Route
              path="/holding/:holdingId"
              element={<HoldingTransactions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
                  <Header />
                  <main className="flex-grow">
                    <Hero />
                    <AssetTable />
                    <Features />
                    <Testimonials />
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </LoadingProvider>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
