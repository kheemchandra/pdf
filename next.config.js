/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return {
      afterFiles: [
      {
        source: '/pdf1/msg.html',
        destination: '/static/no.html'
      },
      {
        // source: 'https://pdf-production.up.railway.app/pdf/cover.xhtml',
        source: '/pdf/cover.xhtml',
        destination: '/pdf/cover.xhtml'
      } 
    ],
    beforeFiles: [ 
      {
        // source:  'https://pdf-production.up.railway.app/pdf/page002.xhtml',
        source: '/pdf/p2',
        destination: '/pdf/page002.xhtml',
      }
    ]
  }
  }
}

module.exports = nextConfig
