require("dotenv").config();
const express = require("express");
const ConnectToMongoDB = require("./database");
var cors = require('cors')


ConnectToMongoDB();
const app = express();
const port = process.env.APP_PORT;
const Cors_Config = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.options("", cors(Cors_Config));
app.use(cors(Cors_Config));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/app/api/contact' , require('./routes/Contact'))

app.listen(port, () => {
  console.log(`backend app listing on http://localhost:${port}`);

});
