module.exports = {
  reactStrictMode: true,
  experimental: {
    emotion: true,
  },
  async headers() {
    return [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
    ];
  },
};
