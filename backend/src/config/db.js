require('dotenv').config();

const baseConfig = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Crucial for cloud providers like Neon, Supabase, or Render
    }
  }
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig
};