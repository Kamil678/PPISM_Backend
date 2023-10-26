const express = require("express");
const projectController = require("../controllers/project");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/projects", isAuth, projectController.getProjects);

router.post("/project", isAuth, [body("title").trim().isLength({ min: 5 }), body("description").trim().isLength({ min: 5 })], projectController.createProject);

router.get("/project/:projectId", isAuth, projectController.getProject);

router.delete("/project/:projectId", isAuth, projectController.deleteProject);

module.exports = router;
