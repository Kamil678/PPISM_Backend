const Project = require("../models/project");
const User = require("../models/user");
const TechnologicalDocumentations = require("../models/technologicalDocumentations");

exports.createTechnologicalDocuemntations = (req, res, next) => {
  const operations = req.body.operations;
  const project = req.body.project;
  let wholeProject;

  const technologicalDocumentations = new TechnologicalDocumentations({
    operations: operations,
    project: project,
  });

  technologicalDocumentations
    .save()
    .then((result) => {
      return Project.findById(project);
    })
    .then((project) => {
      wholeProject = project;
      project.technologicalDocumentations = technologicalDocumentations;
      return project.save();
    })
    .then((result) => {
      return Project.findById(project);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.technologicalDocumentations.push(technologicalDocumentations);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Technological documentations created successfully!",
        technologicalDocumentations: technologicalDocumentations,
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

exports.getTechnologicalDocumentations = (req, res, next) => {
  const technologicalDocumentationsId = req.params.technologicalDocumentationsId;

  TechnologicalDocumentations.findById(technologicalDocumentationsId)
    .then((technologicalDocumentations) => {
      if (!technologicalDocumentations) {
        const error = new Error("Could not find technological documentations.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Technological documentations fetched.", technologicalDocumentations: technologicalDocumentations });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTechnologicalDocumentations = (req, res, next) => {
  const technologicalDocumentationsId = req.params.technologicalDocumentationsId;
  const operations = req.body.operations;

  TechnologicalDocumentations.findById(technologicalDocumentationsId)
    .then((technologicalDocumentations) => {
      if (!technologicalDocumentations) {
        const error = new Error("Could not find technological documentations.");
        error.statusCode = 404;
        throw error;
      }

      technologicalDocumentations.operations = operations;

      return technologicalDocumentations.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Technological documentations updated!", technologicalDocumentations: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTechnologicalDocumentations = (req, res, next) => {
  const technologicalDocumentationsId = req.params.technologicalDocumentationsId;
  let technologicalDocumentationsGlobal;

  TechnologicalDocumentations.findById(technologicalDocumentationsId)
    .then((technologicalDocumentations) => {
      if (!technologicalDocumentations) {
        const error = new Error("Could not find technological documentations.");
        error.statusCode = 404;
        throw error;
      }

      technologicalDocumentationsGlobal = technologicalDocumentations;

      return TechnologicalDocumentations.findByIdAndRemove(technologicalDocumentationsId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.technologicalDocumentations.pull(technologicalDocumentationsId);
      return user.save();
    })
    .then((result) => {
      return Project.findById(technologicalDocumentationsGlobal.project);
    })
    .then((project) => {
      project.technologicalDocumentations = undefined;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted technological documentations." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
