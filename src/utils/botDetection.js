// Bot Detection Utilities for SEO

export class BotDetector {
  static isBot(userAgent = navigator.userAgent) {
    const botPatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i, // Yahoo
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
      /applebot/i,
      /crawler/i,
      /spider/i,
      /bot/i,
      /crawl/i,
      /scraper/i,
      /fetch/i,
      /monitor/i,
      /validator/i,
      /preview/i,
      /lighthouse/i,
      /pagespeed/i,
      /gtmetrix/i,
      /pingdom/i,
      /uptime/i,
      /semrushbot/i,
      /ahrefsbot/i,
      /mj12bot/i,
      /dotbot/i
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  static getBotType(userAgent = navigator.userAgent) {
    const botTypes = {
      google: /googlebot/i,
      bing: /bingbot/i,
      yahoo: /slurp/i,
      duckduckgo: /duckduckbot/i,
      baidu: /baiduspider/i,
      yandex: /yandexbot/i,
      facebook: /facebookexternalhit/i,
      twitter: /twitterbot/i,
      linkedin: /linkedinbot/i,
      whatsapp: /whatsapp/i,
      telegram: /telegrambot/i,
      apple: /applebot/i,
      seo_tool: /(semrushbot|ahrefsbot|mj12bot|dotbot)/i,
      performance: /(lighthouse|pagespeed|gtmetrix|pingdom)/i
    };

    for (const [type, pattern] of Object.entries(botTypes)) {
      if (pattern.test(userAgent)) {
        return type;
      }
    }

    return this.isBot(userAgent) ? 'unknown_bot' : 'human';
  }

  static isSearchEngineBot(userAgent = navigator.userAgent) {
    const searchEngineBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i
    ];

    return searchEngineBots.some(pattern => pattern.test(userAgent));
  }

  static isSocialMediaBot(userAgent = navigator.userAgent) {
    const socialBots = [
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i
    ];

    return socialBots.some(pattern => pattern.test(userAgent));
  }

  static shouldPrerender(userAgent = navigator.userAgent) {
    // Prerender for search engines and social media bots
    return this.isSearchEngineBot(userAgent) || this.isSocialMediaBot(userAgent);
  }

  static getOptimizedContent(userAgent = navigator.userAgent) {
    const botType = this.getBotType(userAgent);
    
    switch (botType) {
      case 'google':
      case 'bing':
      case 'yahoo':
        return {
          prioritizeContent: true,
          includeStructuredData: true,
          minimizeJavaScript: true,
          includeFullText: true
        };
      
      case 'facebook':
      case 'twitter':
      case 'linkedin':
        return {
          prioritizeOpenGraph: true,
          includeImages: true,
          includeDescription: true,
          minimizeJavaScript: true
        };
      
      case 'seo_tool':
        return {
          includeAllMetaTags: true,
          includeStructuredData: true,
          showFullContent: true,
          includeInternalLinks: true
        };
      
      default:
        return {
          normalContent: true
        };
    }
  }
}

// Server-side rendering detection
export const isServerSide = () => {
  return typeof window === 'undefined';
};

// Check if we're in a prerendering environment
export const isPrerenderEnvironment = () => {
  if (isServerSide()) return true;
  
  // Check for common prerendering indicators
  return !!(
    window.navigator.userAgent.includes('prerender') ||
    window.navigator.userAgent.includes('Prerender') ||
    window.__PRERENDER_INJECTED ||
    window.__REACT_SNAP__
  );
};

// Enhanced bot detection with additional checks
export const detectEnvironment = () => {
  if (isServerSide()) {
    return { type: 'server', isBot: true, shouldOptimize: true };
  }

  const userAgent = navigator.userAgent;
  const isBot = BotDetector.isBot(userAgent);
  const botType = BotDetector.getBotType(userAgent);
  const isPrerender = isPrerenderEnvironment();

  return {
    type: isPrerender ? 'prerender' : 'client',
    isBot,
    botType,
    shouldOptimize: isBot || isPrerender,
    optimizations: BotDetector.getOptimizedContent(userAgent)
  };
};

// Hook for React components
export const useBotDetection = () => {
  const [environment, setEnvironment] = React.useState(null);

  React.useEffect(() => {
    setEnvironment(detectEnvironment());
  }, []);

  return environment;
};

export default BotDetector;