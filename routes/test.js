const express = require("express");
const testController = require("../controllers/test");
const {
    body
} = require('express-validator')

const router = express.Router();

router.get("/test", testController.getTest);

module.exports = router;