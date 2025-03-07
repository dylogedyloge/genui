// Proxy configuration
const PROXY_CONFIG = {
  host: "cdn.smatrip.com",
  port: "39210",
  username: "Jungp2jf5I",
  password: "866OI8O8nZ",
};

// Override global fetch and WebSocket
export const setupProxy = () => {
  if (typeof window !== "undefined") {
    // Override WebSocket
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (url: string, protocols?: string | string[]) {
      const parsedUrl = new URL(url);
      const proxyUrl = `wss://${PROXY_CONFIG.username}:${PROXY_CONFIG.password}@${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`;

      // Keep the original path and query parameters
      const finalUrl = `${proxyUrl}${parsedUrl.pathname}${parsedUrl.search}`;
      return new OriginalWebSocket(finalUrl, protocols);
    } as any;

    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      const proxyUrl = `http://${PROXY_CONFIG.username}:${PROXY_CONFIG.password}@${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`;
      const finalUrl = url.replace(/^https?:\/\//, `http://${proxyUrl}/`);

      return originalFetch(finalUrl, {
        ...init,
        headers: {
          ...init?.headers,
          Connection: "keep-alive",
          "Proxy-Connection": "keep-alive",
        },
      });
    };
  }
  return true;
};
