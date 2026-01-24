/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true, // enabling typed routes for Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;