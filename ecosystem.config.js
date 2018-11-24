module.exports = {
  apps: [{
    name: "MUV",
    script: "server.js",
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env_production: {
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      user: "claudiun",
      host: "68.183.140.93",
      ref: "origin/master",
      repo: "https://github.com/NicTechSolutions/nodejs-mongodb-auth.git",
      path: "/home/claudiun/nodejs-mongodb-auth",
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};