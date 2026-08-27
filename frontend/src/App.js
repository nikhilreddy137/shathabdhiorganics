import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import SmoothScroll from "./components/SmoothScroll";
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
import AdminShopify from "./pages/AdminShopify";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SmoothScroll>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/:slug" element={<BestSellers />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin/shopify" element={<AdminShopify />} />
            <Route path="/about" element={<About />} />
            <Route path="/social" element={<Social />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
          <MobileStickyBar />
        </CartProvider>
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
