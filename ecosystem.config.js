// PM2 process config — Docker ашиглахгүй VPS дээр (жишээ нь Datacom)
// Ашиглах:  npm ci && npm run build && pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nokhor-store',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Орчны хувьсагчдыг .env.production файлд бичнэ
        // (Next.js production үед автоматаар уншина).
      },
    },
  ],
}
