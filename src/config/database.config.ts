interface DatabaseConfig {
  databaseConnection: string | 'mysql';
  databaseHost: string | number;
  databasePort: number;
  databaseUsername: string;
  databasePassword: string;
  databaseName: string;
}

export default (): DatabaseConfig => ({
  databaseConnection: process.env.DB_CONNECTION || 'mysql',
  databaseHost: process.env.DB_HOST,
  databasePort: parseInt(process.env.DB_PORT, 10) || 3306,
  databaseUsername: process.env.DB_USERNAME,
  databasePassword: process.env.DB_PASSWORD,
  databaseName: process.env.DB_DATABASE,
});
