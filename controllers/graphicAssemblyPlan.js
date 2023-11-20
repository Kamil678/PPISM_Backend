const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const Project = require("../models/project");
const User = require("../models/user");
const AssemblyStructure = require("../models/assemblyStructure");
const GraphicAssemblyPlan = require("../models/graphicAssemblyPlan");

// exports.getAssemblyStructures = (req, res, next) => {
//   AssemblyStructure.find()
//     //.countDocuments()
//     .then((assemblyStructure) => {
//       // totalItems = count;
//       return AssemblyStructure.find({ owner: req.userId });
//       // .skip((currentPage - 1) * perPage)
//       // .limit(perPage);
//     })
//     .then((assemblyStructures) => {
//       res.status(200).json({
//         message: "Fetched projects successfully.",
//         assemblyStructures: assemblyStructures,
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

exports.createGraphicAssemblyPlan = (req, res, next) => {
  const teams = req.body.teams;
  const projectId = req.body.projectId;
  const assemblyStructureId = req.body.assemblyStructureId;
  let owner;
  let wholeProject;

  const graphicAssemblyPlan = new GraphicAssemblyPlan({
    teams: teams,
    projectId: projectId,
    assemblyStructureId: assemblyStructureId,
    owner: req.userId,
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

  const teams = req.body.teams;
  const projectId = req.body.projectId;
  const assemblyStructureId = req.body.assemblyStructureId;

  GraphicAssemblyPlan.findById(graphicAssemblyPlanId)
    .then((graphicAssemblyPlan) => {
      if (!graphicAssemblyPlan) {
        const error = new Error("Could not find graphic assembly plan.");
        error.statusCode = 404;
        throw error;
      }
      if (graphicAssemblyPlan.owner.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      graphicAssemblyPlan.teams = teams;
      graphicAssemblyPlan.projectId = projectId;
      graphicAssemblyPlan.assemblyStructureId = assemblyStructureId;

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
      if (graphicAssemblyPlan.owner.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
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
