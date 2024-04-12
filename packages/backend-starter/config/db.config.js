require('dotenv').config({
  path: `environments/.env.${process.env.NODE_ENV || 'development'}`,
});

module.exports = {
  dialect: 'postgres',
  host: process.env.BACKEND_POSTGRESQL_HOST,
  port: process.env.BACKEND_POSTGRESQL_PORT,
  username: process.env.BACKEND_POSTGRESQL_USER,
  password: process.env.BACKEND_POSTGRESQL_ROOT_PASSWORD,
  database: process.env.BACKEND_POSTGRESQL_DB,
  logging: global.console.log,
  define: {
    timestamps: true,
  },
  migrationStorage: 'sequelize',
  seederStorage: 'sequelize',
  migrationStorageTableName: 'SequelizeMeta',
  seederStorageTableName: 'SequelizeData',
};
