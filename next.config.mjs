/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Remove swcMinify as it's not compatible with Turbopack
    // Other experimental features
    webpackBuildWorker: true,
  },
  // Webpack optimizations
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize for development
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**'],
        poll: 500, // Reduce polling time
        aggregateTimeout: 300,
      }
      
      // Disable some development-only features
      config.optimization = {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    return config
  },
  // Development optimizations
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // 15 seconds
    pagesBufferLength: 2,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Add headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Increase header size limit
  serverRuntimeConfig: {
    maxHeaderSize: 32768, // 32KB
  },
}

export default nextConfig
