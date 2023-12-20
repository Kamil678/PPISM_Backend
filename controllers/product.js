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
  const imageProduct = req.body.imageProduct;
  const seriesSize = req.body.seriesSize;
  const parts = req.body.parts;
  const project = req.body.projectId;
  const yearlyProductionProgram = req.body.yearlyProductionProgram;
  const DpT = req.body.DpT;
  const IZ = req.body.IZ;
  const TnZ = req.body.TnZ;
  const TnP = req.body.TnP;
  const DpR = req.body.DpR;
  const Fd = req.body.Fd;
  const Fe = req.body.Fe;
  const p = req.body.p;
  const TTh = req.body.TTh;
  const TTm = req.body.TTm;
  const TTs = req.body.TTs;
  const Pdz = req.body.Pdz;
  const Pzm = req.body.Pzm;

  const product = new Product({
    name: name,
    numberFromAssemblyDraw: numberFromAssemblyDraw,
    imageProduct: imageProduct,
    seriesSize: seriesSize,
    parts: parts,
    project: project,
    yearlyProductionProgram: yearlyProductionProgram,
    DpT: DpT,
    IZ: IZ,
    TnZ: TnZ,
    TnP: TnP,
    DpR: DpR,
    Fd: Fd,
    Fe: Fe,
    p: p,
    TTh: TTh,
    TTm: TTm,
    TTs: TTs,
    Pdz: Pdz,
    Pzm: Pzm,
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
  const imageProduct = req.body.imageProduct;
  const seriesSize = req.body.seriesSize;
  const parts = req.body.parts;
  const project = req.body.projectId;
  const yearlyProductionProgram = req.body.yearlyProductionProgram;
  const DpT = req.body.DpT;
  const IZ = req.body.IZ;
  const TnZ = req.body.TnZ;
  const TnP = req.body.TnP;
  const DpR = req.body.DpR;
  const Fd = req.body.Fd;
  const Fe = req.body.Fe;
  const p = req.body.p;
  const TTh = req.body.TTh;
  const TTm = req.body.TTm;
  const TTs = req.body.TTs;
  const Pdz = req.body.Pdz;
  const Pzm = req.body.Pzm;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find product.");
        error.statusCode = 404;
        throw error;
      }

      product.name = name;
      product.numberFromAssemblyDraw = numberFromAssemblyDraw;
      product.imageProduct = imageProduct;
      product.seriesSize = seriesSize;
      product.parts = parts;
      product.project = project;
      product.yearlyProductionProgram = yearlyProductionProgram;
      product.DpT = DpT;
      product.IZ = IZ;
      product.TnZ = TnZ;
      product.TnP = TnP;
      product.DpR = DpR;
      product.Fd = Fd;
      product.Fe = Fe;
      product.p = p;
      product.TTh = TTh;
      product.TTm = TTm;
      product.TTs = TTs;
      product.Pdz = Pdz;
      product.Pzm = Pzm;

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
