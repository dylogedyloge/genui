/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'api.atripa.com', 
            port: '', 
            pathname: '/media/airlines/**', 
          },
        ],
      },
};

export default nextConfig;
