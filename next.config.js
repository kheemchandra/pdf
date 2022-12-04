/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/check',
        destination: '/static/index.html'
      }
    ]
  }
}

module.exports = nextConfig
