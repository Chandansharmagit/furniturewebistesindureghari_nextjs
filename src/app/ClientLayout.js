"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Header from "../component/header/Header";
import Navbar from "../component/navbar/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const Footer = dynamic(() => import("../component/footer/footer"), {
  loading: () => null,
});

const FloatingActionDock = dynamic(() => import("../component/popup/FloatingActionDock"), {
  loading: () => null,
  ssr: false,
});

const FloatingOrderRequest = dynamic(() => import("../component/popup/FloatingOrderRequest"), {
  loading: () => null,
  ssr: false,
});

const FloatingContact = dynamic(() => import("../component/popup/FloatingContact"), {
  loading: () => null,
  ssr: false,
});

const FloatingFeedback = dynamic(() => import("../component/popup/FloatingFeedback"), {
  loading: () => null,
  ssr: false,
});

const PopupManager = dynamic(() => import("../component/popup/PopupManager"), {
  loading: () => null,
  ssr: false,
});

const CookieConsentBanner = dynamic(() => import("../component/common/CookieConsentBanner"), {
  loading: () => null,
  ssr: false,
});

const ChatbaseWidget = dynamic(() => import("../component/common/ChatbaseWidget"), {
  loading: () => null,
  ssr: false,
});

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Floating popups visibility states
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Check if current route is an admin page
  const isAdminPage = pathname ? pathname.startsWith("/admin") : false;

  return (
    <AuthProvider>
      <CartProvider>
        {/* Navigation & Header - Hide on Admin Pages */}
        {!isAdminPage && (
          <>
            <Header
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <Navbar 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            />
          </>
        )}

        {/* Main Application Content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* Footer - Hide on Admin Pages */}
        {!isAdminPage && <Footer />}

        {/* Floating Actions Hub & Overlays - Hide on Admin Pages */}
        {!isAdminPage && (
          <>
            <FloatingActionDock
              onOpenOrder={() => setIsOrderOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />

            {isOrderOpen && (
              <FloatingOrderRequest
                isOpen={isOrderOpen}
                onClose={() => setIsOrderOpen(false)}
              />
            )}
            {isContactOpen && (
              <FloatingContact
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
              />
            )}
            {isFeedbackOpen && (
              <FloatingFeedback
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
              />
            )}
          </>
        )}

        {/* Global Popup Overlays & Cookies */}
        <PopupManager />
        <CookieConsentBanner />
        <ChatbaseWidget />
      </CartProvider>
    </AuthProvider>
  );
}
