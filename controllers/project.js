const { validationResult } = require("express-validator");
const Project = require("../models/project");
const User = require("../models/user");

exports.getProjects = (req, res, next) => {
  Project.find()
    .then((projects) => {
      return Project.find({ owner: req.userId });
    })
    .then((projects) => {
      res.status(200).json({
        message: "Fetched projects successfully.",
        projects: projects,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProject = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const description = req.body.description;
  let owner;

  const project = new Project({
    title: title,
    description: description,
    owner: req.userId,
  });

  project
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      owner = user;
      user.projects.push(project);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Project created successfully!",
        project: project,
        owner: { _id: owner._id, name: owner.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProject = (req, res, next) => {
  const projectId = req.params.projectId;

  Project.findById(projectId)
    .populate("product")
    .then((project) => {
      if (!project) {
        const error = new Error("Could not find project.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Project fetched.", project: project });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProject = (req, res, next) => {
  const projectId = req.params.projectId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const description = req.body.description;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Could not find project.");
        error.statusCode = 404;
        throw error;
      }
      if (project.owner.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      project.title = title;
      project.description = description;

      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Project updated!", project: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProjectStatus = (req, res, next) => {
  const projectId = req.params.projectId;
  const status = req.body;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Could not find project.");
        error.statusCode = 404;
        throw error;
      }
      if (project.owner.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      project.status = status;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Status project updated!", project: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProject = (req, res, next) => {
  const projectId = req.params.projectId;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Could not find project.");
        error.statusCode = 404;
        throw error;
      }
      if (project.owner.toString() !== req.userId) {
        console.log(project.owner.toString(), req.userId);
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      return Project.findByIdAndRemove(projectId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.projects.pull(projectId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted project." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
