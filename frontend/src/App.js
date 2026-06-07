import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import MobileStickyBar from "./components/MobileStickyBar";
import Home from "./pages/Home";
import BestSellers from "./pages/BestSellers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Social from "./pages/Social";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/best-sellers" element={<BestSellers />} />
            <Route path="/collections/millets" element={<BestSellers />} />
            <Route path="/collections/spices" element={<BestSellers />} />
            <Route path="/collections/spices-and-powders" element={<BestSellers />} />
            <Route path="/collections/dals" element={<BestSellers />} />
            <Route path="/collections/oils" element={<BestSellers />} />
            <Route path="/collections/cookies" element={<BestSellers />} />
            <Route path="/collections/rices" element={<BestSellers />} />
            <Route path="/collections/processed-products" element={<BestSellers />} />
            <Route path="/collections/snacks-and-bars" element={<BestSellers />} />
            <Route path="/collections/sweets-and-treats" element={<BestSellers />} />
            <Route path="/collections/health-drinks" element={<BestSellers />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/social" element={<Social />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
          <MobileStickyBar />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
