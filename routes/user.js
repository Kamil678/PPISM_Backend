const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user/:userId", isAuth, userController.getUser);

router.put("/user/:userId", isAuth, [body("email").isEmail().withMessage("Proszę wpisać prawidłowy email").normalizeEmail(), body("name").trim().not().isEmpty(), body("surname").trim().not().isEmpty()], userController.updateUser);

router.delete("/user/:userId", isAuth, userController.deleteUser);

module.exports = router;
