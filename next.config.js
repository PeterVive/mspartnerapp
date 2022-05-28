const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    emotion: true,
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/{{member}}",
      },
      lodash: {
        transform: "lodash/{{member}}",
      },
    },
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
});
