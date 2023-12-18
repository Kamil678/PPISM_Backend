const express = require("express");
const productController = require("../controllers/product");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/products", isAuth, productController.getProducts);

router.post("/product", isAuth, [body("name").notEmpty(), body("parts").notEmpty()], productController.createProduct);

router.get("/product/:productId", isAuth, productController.getProduct);

router.put("/product/:productId", isAuth, [body("name").notEmpty(), body("parts").notEmpty()], productController.updateProduct);

router.delete("/product/:productId", isAuth, productController.deleteProduct);

router.post("/upload-image", isAuth, productController.uploadImage);

module.exports = router;
