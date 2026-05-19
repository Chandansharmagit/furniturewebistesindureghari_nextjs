import { useEffect } from 'react';

const ChatbaseWidget = () => {
    useEffect(() => {
        // Check if configuration exists
        const chatbotId = process.env.REACT_APP_CHATBASE_ID;
        const host = process.env.REACT_APP_CHATBASE_HOST || "https://www.chatbase.co";

        if (!chatbotId) {
            console.warn("Chatbase ID is missing in environment variables.");
            return;
        }

        // Set configuration on window object as required by Chatbase
        window.chatbaseConfig = {
            chatbotId: chatbotId,
        };

        // Create script element
        const script = document.createElement("script");
        script.src = `${host}/embed.min.js`;
        script.id = chatbotId;
        script.domain = host.replace("https://", "").replace("http://", "");
        script.defer = true;

        // Append script to document body
        document.body.appendChild(script);

        // Cleanup on unmount
        return () => {
            const existingScript = document.getElementById(chatbotId);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
            delete window.chatbaseConfig;
        };
    }, []);

    return null; // This component doesn't render anything itself
};

export default ChatbaseWidget;
