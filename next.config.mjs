/** @type {import('next').NextConfig} */
const nextConfig = {
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
    serverComponentsExternalPackages: ['ws'],
    // serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/api/voice',
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
    domains: ["api.atripa.ir"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.atripa.ir",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;