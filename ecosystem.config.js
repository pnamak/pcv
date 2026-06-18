module.exports = {
  apps: [
    {
      name: "pcv",
      cwd: "/var/www/pcv",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        COOKIE_SECURE: "false",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
