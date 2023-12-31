const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");

//Import routes
const projectRoutes = require("./routes/project");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const assemblyStructureRoutes = require("./routes/assemblyStructure");
const graphicAssemblyPlanRoutes = require("./routes/graphicAssemblyPlan");
const technologicalDocumentationsRoutes = require("./routes/technologicalDocumentations");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y79siij.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("imageProduct"));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-inline");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", assemblyStructureRoutes);
app.use("/api", graphicAssemblyPlanRoutes);
app.use("/api", technologicalDocumentationsRoutes);

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
