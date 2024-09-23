require("dotenv").config();
const express = require("express");
const ConnectToMongoDB = require("./database");
var cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const cluster = require("cluster");
const numCPUs = require("os").availableParallelism();

ConnectToMongoDB();
const app = express();
const port = process.env.APP_PORT;
const Cors_Config = {
  origin: "varunpatel.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.options("", cors(Cors_Config));
app.use(cors(Cors_Config));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
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
    console.log(`backend app listing on http://localhost:${port}`);
  });
}
