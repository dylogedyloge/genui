/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'api.atripa.com', // Hostname of the image source
            port: '', // No specific port needed
            pathname: '/media/airlines/**', // Adjust this path if necessary
          },
        ],
      },
};

export default nextConfig;
