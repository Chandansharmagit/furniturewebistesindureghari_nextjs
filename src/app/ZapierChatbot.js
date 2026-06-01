"use client";

import { useEffect } from "react";

const ZAPIER_SCRIPT_ID = "zapier-interfaces-script";
const ZAPIER_CHATBOT_ID = "zapier-interfaces-chatbot";

export default function ZapierChatbot() {
  useEffect(() => {
    if (!document.getElementById(ZAPIER_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = ZAPIER_SCRIPT_ID;
      script.type = "module";
      script.async = true;
      script.src = "https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js";
      document.body.appendChild(script);
    }

    if (!document.getElementById(ZAPIER_CHATBOT_ID)) {
      const chatbot = document.createElement("zapier-interfaces-chatbot-embed");
      chatbot.id = ZAPIER_CHATBOT_ID;
      chatbot.setAttribute("is-popup", "true");
      chatbot.setAttribute("chatbot-id", "cmpcld4d7005o2jauy2hg9syg");
      document.body.appendChild(chatbot);
    }
  }, []);

  return null;
}
