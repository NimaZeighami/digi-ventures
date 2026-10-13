module.exports = {
  apps: [
    {
      name: "digiventures-web",
      script: "./server.js",
      cwd: "/var/app/digiventures",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/digiventures/err.log",
      out_file: "/var/log/digiventures/out.log",
      log_file: "/var/log/digiventures/combined.log",
      time: true,
    },
    {
      name: "digiventures-email-worker",
      script: "./scripts/outbox-worker.js",
      cwd: "/var/app/digiventures",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
      error_file: "/var/log/digiventures/worker-err.log",
      out_file: "/var/log/digiventures/worker-out.log",
      time: true,
    },
  ],
};
