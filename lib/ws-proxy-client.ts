export function createProxiedWebSocket(url: string, protocols?: string | string[]) {
    // Only proxy WebSocket connections to OpenAI
    if (typeof url === 'string' && (url.includes('openai.com') || url.includes('api.openai.com'))) {
      console.log(`Proxying WebSocket to: ${url}`);
      
      // Get the origin for the current page
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Create proxy URL for WebSocket
      const proxyUrl = `${origin.replace('http', 'ws')}/api/ws-proxy?url=${encodeURIComponent(url)}`;
      
      return new WebSocket(proxyUrl, protocols);
    } else {
      return new WebSocket(url, protocols);
    }
  }