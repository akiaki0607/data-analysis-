module.exports = {
  apps: [{
    name: 'yishan-official',
    script: 'npm',
    args: 'start',
    instances: 1,  // Next.js 默认单实例（已内置优化）
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5280
    },
    // 日志配置
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // 自动重启配置
    watch: false,
    max_memory_restart: '1G',
    autorestart: true,
    // 优雅重启
    kill_timeout: 5000,
    wait_ready: false,
    listen_timeout: 10000,
    // Node.js 选项（如需增加内存限制，取消注释）
    // node_args: '--max-old-space-size=2048'
  }]
};

