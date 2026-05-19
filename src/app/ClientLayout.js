"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "../component/header/Header";
import Navbar from "../component/navbar/Navbar";
import Footer from "../component/footer/footer";
import GlobalAnnouncement from "../component/announcement/GlobalAnnouncement";
import FloatingActionDock from "../component/popup/FloatingActionDock";
import FloatingOrderRequest from "../component/popup/FloatingOrderRequest";
import FloatingContact from "../component/popup/FloatingContact";
import FloatingFeedback from "../component/popup/FloatingFeedback";
import PopupManager from "../component/popup/PopupManager";
import ChatbaseWidget from "../component/common/ChatbaseWidget";
import CookieConsentBanner from "../component/common/CookieConsentBanner";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

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

            <FloatingOrderRequest
              isOpen={isOrderOpen}
              onClose={() => setIsOrderOpen(false)}
            />
            <FloatingContact
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
            />
            <FloatingFeedback
              isOpen={isFeedbackOpen}
              onClose={() => setIsFeedbackOpen(false)}
            />
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
