import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    name: "Career Recommender API",
    version: "1.0.0",
    docs: "/api/health, /api/options, /api/recommendations",
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
