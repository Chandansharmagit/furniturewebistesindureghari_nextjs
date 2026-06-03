import { useEffect } from 'react';

const CHATBASE_SCRIPT_ID = 'wqtOEprlA4fTzBKY7_eHt';
const CHATBASE_SCRIPT_SRC = 'https://www.chatbase.co/embed.min.js';
const CHATBASE_DOMAIN = 'www.chatbase.co';

const ChatbaseWidget = () => {
    useEffect(() => {
        if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) {
                    window.chatbase.q = [];
                }
                window.chatbase.q.push(args);
            };

            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === 'q') {
                        return target.q;
                    }
                    return (...args) => target(prop, ...args);
                }
            });
        }

        if (document.getElementById(CHATBASE_SCRIPT_ID)) {
            return undefined;
        }

        const script = document.createElement("script");
        script.src = CHATBASE_SCRIPT_SRC;
        script.id = CHATBASE_SCRIPT_ID;
        script.domain = CHATBASE_DOMAIN;
        document.body.appendChild(script);

        return () => {
            const existingScript = document.getElementById(CHATBASE_SCRIPT_ID);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    return null;
};

export default ChatbaseWidget;
