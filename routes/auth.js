const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Proszę wpisać prawidłowy email")
      .custom((value, { req }) => {
        return User.findOne({
          email: value,
        }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Użytkownik z takim emailem już istnieje");
          }
        });
      })
      .normalizeEmail(),

    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
    body("surname").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
