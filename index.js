require("dotenv").config();
const express = require("express");
const ConnectToMongoDB = require("./database");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
const port = process.env.APP_PORT;
const isProduction = process.env.NODE_ENV === "production";

const Cors_Config = {
  origin: "https://varunpatel.vercel.app",
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

ConnectToMongoDB(); // Only workers should initialize the DB connection

app.use("/app/api/contact", require("./routes/Contact"));

app.listen(port, () => {
  console.log(`Backend app listening on http://localhost:${port}`);
});

// Error handler for unhandled exceptions
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).send(isProduction ? "Internal Server Error" : err.message);
});
