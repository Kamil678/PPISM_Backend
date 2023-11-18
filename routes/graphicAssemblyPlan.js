const express = require("express");
const graphicAssemblyPlanController = require("../controllers/graphicAssemblyPlan");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/graphic-assembly-plan", isAuth, graphicAssemblyPlanController.createGraphicAssemblyPlan);

router.get("/graphic-assembly-plan/:graphicAssemblyPlanId", isAuth);

router.put("/graphic-assembly-plan/:graphicAssemblyPlanId", isAuth);

router.delete("/graphic-assembly-plan/:graphicAssemblyPlanId", isAuth, graphicAssemblyPlanController.deleteGraphicAssemblyPlan);

module.exports = router;
