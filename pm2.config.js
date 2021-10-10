module.exports = {
  apps: [{
    name: "raven-webmail",
    script: "node raven.js start",
    exec_mode: "fork",
    instances: 1,
    wait_ready: false,
    time: true,
    log_date_format: "YYYY-MM-DD HH:mm:SS UTC-3",
    merge_logs: true,
    max_memory_restart: '300M',
    kill_timeout : 10_000,
    env: { NODE_ENV: "production" }
  }] 
}