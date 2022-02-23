interface AppConfig {
  port: number;
  sessionSecret: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.APP_PORT, 10) || 4000,
  sessionSecret: process.env.SESSION_SECRET_KEY || '',
});
