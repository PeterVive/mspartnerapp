module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    emotion: true,
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/{{member}}",
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
};
