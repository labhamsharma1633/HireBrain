import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "your_database_url_here",
  NODE_ENV: process.env.NODE_ENV || "development",
};
