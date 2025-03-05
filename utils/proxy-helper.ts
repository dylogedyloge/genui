// Create a proxy URL with authentication
const PROXY_URL = 'http://Jungp2jf5I:866OI8O8nZ@cdn.smatrip.com:39210';

// Override global fetch
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();
  const proxyUrl = url.replace(/^https?:\/\//, `http://${PROXY_URL}/`);
  
  return originalFetch(proxyUrl, {
    ...init,
    headers: {
      ...init?.headers,
      'Connection': 'keep-alive',
      'Proxy-Connection': 'keep-alive'
    }
  });
};

export const setupProxy = () => {
  // This is just to trigger the global fetch override
  return true;
};