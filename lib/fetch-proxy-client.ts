export async function proxiedFetch(url: string, options?: RequestInit) {
    // Only proxy requests to OpenAI
    if (typeof url === 'string' && (url.includes('openai.com') || url.includes('api.openai.com'))) {
      console.log(`Proxying HTTP request to: ${url}`);
      
      // Get the origin for the current page
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      if (options?.method === 'GET' || !options?.method) {
        // For GET requests
        const proxyUrl = `${origin}/api/openai-proxy?url=${encodeURIComponent(url)}`;
        return fetch(proxyUrl, {
          ...options,
          method: 'GET'
        });
      } else {
        // For POST requests
        const proxyUrl = `${origin}/api/openai-proxy`;
        return fetch(proxyUrl, {
          ...options,
          method: 'POST',
          body: JSON.stringify({
            url,
            data: options.body ? JSON.parse(options.body.toString()) : {}
          }),
          headers: {
            ...options.headers,
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // For non-OpenAI requests, use regular fetch
    return fetch(url, options);
  }