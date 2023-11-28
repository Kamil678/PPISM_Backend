const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Project = require("../models/project");
const User = require("../models/user");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      return Product.find({ owner: req.userId });
    })
    .then((products) => {
      res.status(200).json({
        message: "Fetched products successfully.",
        products: products,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const numberFromAssemblyDraw = req.body.numberFromAssemblyDraw;
  const seriesSize = req.body.seriesSize;
  const parts = req.body.parts;
  const project = req.body.projectId;
  let wholeProject;

  const product = new Product({
    name: name,
    numberFromAssemblyDraw: numberFromAssemblyDraw,
    seriesSize: seriesSize,
    parts: parts,
    project: project,
  });
  product
    .save()
    .then((result) => {
      return Project.findById(project);
    })
    .then((project) => {
      wholeProject = project;
      project.product = product;
      return project.save();
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.products.push(product);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Product created successfully!",
        project: project,
        //owner: { _id: owner._id, name: owner.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Product fetched.", product: product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const numberFromAssemblyDraw = req.body.numberFromAssemblyDraw;
  const seriesSize = req.body.seriesSize;
  const parts = req.body.parts;
  const project = req.body.projectId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }

      product.name = name;
      product.numberFromAssemblyDraw = numberFromAssemblyDraw;
      product.seriesSize = seriesSize;
      product.parts = parts;
      product.project = project;

      return product.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Product updated!", product: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  let productGlobal;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }

      productGlobal = product;
      return Product.findByIdAndRemove(productId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.products.pull(productId);
      return user.save();
    })
    .then((result) => {
      return Project.findById(productGlobal.project);
    })
    .then((project) => {
      project.product = undefined;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted product." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
