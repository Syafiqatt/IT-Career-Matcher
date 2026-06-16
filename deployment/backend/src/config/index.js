import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: process.env.PGHOST || "127.0.0.1",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "career_recommender",
  },
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://127.0.0.1:8000",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwt: {
    secret: process.env.JWT_SECRET || "careermatch-dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};
