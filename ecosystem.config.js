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
  }, {
    name: "EMAIL",
    script: "src/workers/workerEmail.js",
    instances: "1",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "100M",
    env_production: {
      NODE_ENV: "production"
    }
  }]
};