require("dotenv").config();
const express = require("express");
const ConnectToMongoDB = require("./database");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const cluster = require("cluster");
const numCPUs = require("os").availableParallelism();

ConnectToMongoDB();
const app = express();
const port = process.env.APP_PORT;

const Cors_Config = {
  origin: ["https://varunpatel.vercel.app", "varunpatel-ho1znsg6h-varun-patels-projects.vercel.app", "*"],
  methods: ["POST"],
  credentials: true,
};

// Apply CORS globally
app.use(cors(Cors_Config));
app.options("*", cors(Cors_Config));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  limit: 100,
  skip: (req) => req.method === "OPTIONS", // Skip OPTIONS requests for preflight
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.use("/app/api/contact", require("./routes/Contact"));

  app.listen(port, () => {
    console.log(`backend app listening on http://localhost:${port}`);
  });
}

// Error handler to log 500 errors
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).send("Internal Server Error");
});
