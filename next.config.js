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
        source: 'https://pdf-production.up.railway.app/pdf/cover.xhtml',
        destination: '/pdf/cover.xhtml'
      },
      {
        source:  'https://pdf-production.up.railway.app/pdf/page002.xhtml',
        destination: '/pdf/page002.xhtml',
      }
    ]
  }
}

module.exports = nextConfig
