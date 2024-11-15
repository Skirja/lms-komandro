/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable file system cache to prevent EPERM errors
  experimental: {
    disableOptimizedLoading: true,
    swcFileWatching: false,
    workerThreads: false,
    cpus: 1
  },
  // Disable source maps in development
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
