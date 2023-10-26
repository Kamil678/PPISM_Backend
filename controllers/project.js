const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Project = require("../models/project");
const User = require("../models/user");

exports.getProjects = (req, res, next) => {
  // const currentPage = req.query.page || 1;
  // const perPage = 2;
  // let totalItems;
  Project.find()
    //.countDocuments()
    .then((count) => {
      // totalItems = count;
      return Project.find();
      // .skip((currentPage - 1) * perPage)
      // .limit(perPage);
    })
    .then((projects) => {
      res.status(200).json({
        message: "Fetched projects successfully.",
        projects: projects,
        totalItems: totalItems,
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
  // if (!req.file) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }
  //const imageUrl = req.file.path;
  const title = req.body.title;
  const description = req.body.description;
  let owner;
  const project = new Project({
    title: title,
    description: description,
    //imageUrl: imageUrl,
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
  Post.findById(projectId)
    .then((project) => {
      if (!post) {
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
  //let imageUrl = req.body.image;
  // if (req.file) {
  //   imageUrl = req.file.path;
  // }
  // if (!imageUrl) {
  //   const error = new Error('No file picked.');
  //   error.statusCode = 422;
  //   throw error;
  // }
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
      // if (imageUrl !== post.imageUrl) {
      //   clearImage(post.imageUrl);
      // }
      project.title = title;
      //post.imageUrl = imageUrl;
      project.description = content;
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
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      // clearImage(post.imageUrl);
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
