/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/pdf1/msg.html',
        destination: '/static/no.html'
      },
      {
        source: '/pdf/cover.xhtml',
        destination: '/pdf/cover.xhtml'
      },
      {
        source:  '/pdf/page001.xhtml',
        destination: '/pdf/page001.xhtml',
      }
    ]
  }
}

module.exports = nextConfig
