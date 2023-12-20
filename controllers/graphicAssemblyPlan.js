const Project = require("../models/project");
const User = require("../models/user");
const GraphicAssemblyPlan = require("../models/graphicAssemblyPlan");

exports.createGraphicAssemblyPlan = (req, res, next) => {
  const assemblyUnits = req.body.assemblyUnits;
  const projectId = req.body.projectId;
  let wholeProject;

  const graphicAssemblyPlan = new GraphicAssemblyPlan({
    assemblyUnits: assemblyUnits,
    projectId: projectId,
  });

  graphicAssemblyPlan
    .save()
    .then((result) => {
      return Project.findById(projectId);
    })
    .then((project) => {
      wholeProject = project;
      project.graphicAssemblyPlan = graphicAssemblyPlan;
      return project.save();
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      owner = user;
      user.graphicAssemblyPlans.push(graphicAssemblyPlan);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Graphic assembly plan created successfully!",
        graphicAssemblyPlan: graphicAssemblyPlan,
        project: wholeProject,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getGraphicAssemblyPlan = (req, res, next) => {
  const graphicAssemblyPlanId = req.params.graphicAssemblyPlanId;

  GraphicAssemblyPlan.findById(graphicAssemblyPlanId)
    .then((graphicAssemblyPlan) => {
      if (!graphicAssemblyPlan) {
        const error = new Error("Could not find graphic assembly plan.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Graphic assembly plan fetched.", graphicAssemblyPlan: graphicAssemblyPlan });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateGraphicAssemblyPlan = (req, res, next) => {
  const graphicAssemblyPlanId = req.params.graphicAssemblyPlanId;
  const assemblyUnits = req.body.assemblyUnits;
  const projectId = req.body.projectId;

  GraphicAssemblyPlan.findById(graphicAssemblyPlanId)
    .then((graphicAssemblyPlan) => {
      if (!graphicAssemblyPlan) {
        const error = new Error("Could not find graphic assembly plan.");
        error.statusCode = 404;
        throw error;
      }

      graphicAssemblyPlan.assemblyUnits = assemblyUnits;
      graphicAssemblyPlan.projectId = projectId;

      return graphicAssemblyPlan.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Graphic assembly structure updated!", graphicAssemblyPlan: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteGraphicAssemblyPlan = (req, res, next) => {
  const graphicAssemblyPlanId = req.params.graphicAssemblyPlanId;
  let graphicAssemblyPlanGlobal;

  GraphicAssemblyPlan.findById(graphicAssemblyPlanId)
    .then((graphicAssemblyPlan) => {
      if (!graphicAssemblyPlan) {
        const error = new Error("Could not find graphic assembly plan.");
        error.statusCode = 404;
        throw error;
      }

      graphicAssemblyPlanGlobal = graphicAssemblyPlan;

      return GraphicAssemblyPlan.findByIdAndRemove(graphicAssemblyPlanId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.graphicAssemblyPlans.pull(graphicAssemblyPlanId);
      return user.save();
    })
    .then((result) => {
      return Project.findById(graphicAssemblyPlanGlobal.projectId);
    })
    .then((project) => {
      project.graphicAssemblyPlan = undefined;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted graphic assembly plan." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
