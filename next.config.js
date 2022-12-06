/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/pdf1/msg.html',
        destination: '/static/no.html'
      }
    ]
  }
}

module.exports = nextConfig
