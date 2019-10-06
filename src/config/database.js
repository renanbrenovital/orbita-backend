require('./bootstrap');

module.exports = {
  logging: false,
  storage: './__tests__/database.sqlite',
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
