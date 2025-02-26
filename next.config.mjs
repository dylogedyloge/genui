/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.atripa.ir"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.atripa.com",
        port: "",
        pathname: "/media/airlines/**",
      },
    ],
  },
};

export default nextConfig;
