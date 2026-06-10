"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const Header = dynamic(() => import("../component/header/Header"), {
  loading: () => null,
  ssr: false,
});

const Navbar = dynamic(() => import("../component/navbar/Navbar"), {
  loading: () => null,
  ssr: false,
});

const Footer = dynamic(() => import("../component/footer/footer"), {
  loading: () => null,
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

const ReviewPromptPopup = dynamic(() => import("../component/popup/ReviewPromptPopup"), {
  loading: () => null,
  ssr: false,
});

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadNonCriticalUi, setLoadNonCriticalUi] = useState(false);

  // Check if current route is an admin page
  const isAdminPage = pathname ? pathname.startsWith("/admin") : false;

  useEffect(() => {
    let idleTaskId;
    let timeoutId;

    const enableNonCriticalUi = () => setLoadNonCriticalUi(true);

    if ("requestIdleCallback" in window) {
      idleTaskId = window.requestIdleCallback(enableNonCriticalUi, { timeout: 3500 });
    } else {
      timeoutId = window.setTimeout(enableNonCriticalUi, 1800);
    }

    return () => {
      if (idleTaskId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleTaskId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

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
        {!isAdminPage && loadNonCriticalUi && <Footer />}

        {/* Global Popup Overlays & Cookies */}
        {loadNonCriticalUi && (
          <>
            <PopupManager />
            <CookieConsentBanner />
            {!isAdminPage && <ReviewPromptPopup />}
            <ChatbaseWidget />
          </>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
