/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // 如果您还使用其他外部图片源，可以在这里添加更多配置
    ],
  },
};

export default nextConfig;
