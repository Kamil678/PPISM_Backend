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

exports.updateAssemblyStructure = (req, res, next) => {
  const assemblyStructureId = req.params.assemblyStructureId;

  const teams = req.body.teams;
  const JM1 = req.body.JM1;

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

      console.log(assemblyStructure);
      assemblyStructure.teams = teams;
      assemblyStructure.JM1 = JM1;

      return assemblyStructure.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Assembly structure updated!", assemblyStructure: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

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
