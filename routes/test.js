const express = require("express");
const testController = require("../controllers/test");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/test", isAuth, testController.getTest);

module.exports = router;
