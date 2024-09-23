require("dotenv").config();
const express = require("express");
const ConnectToMongoDB = require("./database");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const cluster = require("cluster");
const numCPUs = require("os").availableParallelism();

const app = express();
const port = process.env.APP_PORT;
const isProduction = process.env.NODE_ENV === "production";

const Cors_Config = {
  origin: ["https://varunpatel.vercel.app", "https://varunpatel-ho1znsg6h-varun-patels-projects.vercel.app"],
  methods: ["POST"],
  credentials: true,
};

app.use(cors(Cors_Config));
app.options("*", cors(Cors_Config));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  limit: 100,
  skip: (req) => req.method === "OPTIONS",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Optional: restart a new worker
  });
} else {
  ConnectToMongoDB(); // Only workers should initialize the DB connection

  app.use("/app/api/contact", require("./routes/Contact"));

  app.listen(port, () => {
    console.log(`Backend app listening on http://localhost:${port}`);
  });
}

// Error handler for unhandled exceptions
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).send(isProduction ? "Internal Server Error" : err.message);
});
