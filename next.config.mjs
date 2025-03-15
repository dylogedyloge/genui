/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['ws', 'socket.io', 'socket.io-client'],
  },
  // Socket.io headers configuration
  async headers() {
    return [
      {
        source: '/api/socket',
        headers: [
          { key: 'Upgrade', value: 'websocket' },
          { key: 'Connection', value: 'Upgrade' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,CONNECT' },
          { key: 'Access-Control-Allow-Headers', value: 'Sec-WebSocket-Protocol,Sec-WebSocket-Key,Sec-WebSocket-Version,Upgrade,Connection' },
        ],
      },
    ];
  },
  images: {
    domains: ["api.atripa.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.atripa.ir",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "cdn-a-hi.partocrs.com",
        port: "",
        pathname: "/**",
      },


      
    ],
  },
};

export default nextConfig;