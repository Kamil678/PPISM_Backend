const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const Project = require("../models/project");
const User = require("../models/user");
const AssemblyStructure = require("../models/assemblyStructure");
const project = require("../models/project");
const assemblyStructure = require("../models/assemblyStructure");

exports.getAssemblyStructures = (req, res, next) => {
  AssemblyStructure.find()
    //.countDocuments()
    .then((assemblyStructure) => {
      // totalItems = count;
      return AssemblyStructure.find({ owner: req.userId });
      // .skip((currentPage - 1) * perPage)
      // .limit(perPage);
    })
    .then((assemblyStructures) => {
      res.status(200).json({
        message: "Fetched projects successfully.",
        assemblyStructures: assemblyStructures,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createAssemblyStructure = (req, res, next) => {
  const teams = req.body.teams;
  const JM1 = req.body.JM1;
  const projectId = req.body.project;
  let owner;
  let wholeProject;
  const assemblyStructure = new AssemblyStructure({
    teams: teams,
    JM1: JM1,
    project: projectId,
    owner: req.userId,
  });
  assemblyStructure
    .save()
    .then((result) => {
      return Project.findById(projectId);
    })
    .then((project) => {
      wholeProject = project;
      project.assemblyStructure = assemblyStructure;
      return project.save();
    })
    .then((result) => {
      return Project.findById(projectId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      owner = user;
      user.assemblyStructures.push(assemblyStructure);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Project created successfully!",
        assemblyStructure: assemblyStructure,
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

exports.getAssemblyStructure = (req, res, next) => {
  const assemblyStructureId = req.params.assemblyStructureId;
  AssemblyStructure.findById(assemblyStructureId)
    .then((assemblyStructure) => {
      if (!assemblyStructure) {
        const error = new Error("Could not find assembly structure.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Assembly structure fetched.", assemblyStructure: assemblyStructure });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// exports.updateProject = (req, res, next) => {
//   const projectId = req.params.projectId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed, entered data is incorrect.");
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const description = req.body.description;
//   const productName = req.body.productName;
//   const parts = req.body.parts;
//   //let imageUrl = req.body.image;
//   // if (req.file) {
//   //   imageUrl = req.file.path;
//   // }
//   // if (!imageUrl) {
//   //   const error = new Error('No file picked.');
//   //   error.statusCode = 422;
//   //   throw error;
//   // }
//   Project.findById(projectId)
//     .then((project) => {
//       if (!project) {
//         const error = new Error("Could not find project.");
//         error.statusCode = 404;
//         throw error;
//       }
//       if (project.owner.toString() !== req.userId) {
//         const error = new Error("Not authorized!");
//         error.statusCode = 403;
//         throw error;
//       }
//       // if (imageUrl !== post.imageUrl) {
//       //   clearImage(post.imageUrl);
//       // }
//       project.title = title;
//       //post.imageUrl = imageUrl;
//       project.description = description;
//       project.productName = productName;
//       project.parts = parts;
//       return project.save();
//     })
//     .then((result) => {
//       res.status(200).json({ message: "Project updated!", project: result });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

exports.deleteAssemblyStructure = (req, res, next) => {
  const assemblyStructureId = req.params.assemblyStructureId;
  let assemblyStructureGlobal;
  AssemblyStructure.findById(assemblyStructureId)
    .then((assemblyStructure) => {
      if (!assemblyStructure) {
        const error = new Error("Could not find assembly structure.");
        error.statusCode = 404;
        throw error;
      }
      if (assemblyStructure.owner.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      assemblyStructureGlobal = assemblyStructure;
      return AssemblyStructure.findByIdAndRemove(assemblyStructureId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.assemblyStructures.pull(assemblyStructureId);
      return user.save();
    })
    .then((result) => {
      return Project.findById(assemblyStructureGlobal.project);
    })
    .then((project) => {
      console.log(project);
      project.assemblyStructure = undefined;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted assembly structure." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
