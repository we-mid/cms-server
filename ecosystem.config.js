module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      exec_mode: 'cluster',
      instances: 3,
      name: 'cms-server',
      script: 'src/server.js'
    },
    {
      name: 'cms-schedule',
      script: 'src/schedule.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    // todo
  }
}
