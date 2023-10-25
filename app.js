const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const testRoutes = require("./routes/test");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Authorization, Accept");
  next();
});

app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

mongoose
  .connect("mongodb+srv://kamilpigulak:tDLmnLBTsMA4syqz@cluster0.y79siij.mongodb.net/ppism?retryWrites=true&w=majority")
  .then((result) => {
    app.listen(8000);
  })
  .catch((err) => console.log(err));
