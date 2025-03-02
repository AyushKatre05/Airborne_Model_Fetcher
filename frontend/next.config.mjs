/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/output/**', // Missile detection processed images
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/processed/**', // Bird detection processed images
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5002',
        pathname: '/processed/**', // Drone detection processed images
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow CORS for all domains (change to specific origins if needed)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};


export default nextConfig;
