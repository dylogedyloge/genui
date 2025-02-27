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
    serverComponentsExternalPackages: ['ws']
  },
  images: {
    domains: ["api.atripa.ir"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.atripa.ir", // Changed from api.atripa.com
        port: "",
        pathname: "/media/**", // Updated to include all media paths
      },
    ],
  },
};

export default nextConfig;