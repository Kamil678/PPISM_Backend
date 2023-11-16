const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const testRoutes = require("./routes/test");
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const assemblyStructureRoutes = require("./routes/assemblyStructure");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y79siij.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Authorization, Accept");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", testRoutes);
app.use("/api", projectRoutes);
app.use("/api", userRoutes);
app.use("/api", assemblyStructureRoutes);

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
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => console.log(err));
