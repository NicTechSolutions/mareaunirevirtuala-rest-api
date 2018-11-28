module.exports = {
  apps: [{
    name: "MUV",
    script: "server.js",
    instances: "4",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "2G",
    env_production: {
      NODE_ENV: "production"
    }
  }]
};