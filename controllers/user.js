const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Project = require("../models/project");

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "User fetched.", user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const surname = req.body.surname;
  const role = req.body.role;
  const email = req.body.email;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      //   if (project.owner.toString() !== req.userId) {
      //     const error = new Error("Not authorized!");
      //     error.statusCode = 403;
      //     throw error;
      //   }
      user.name = name;
      user.surname = surname;
      user.role = role;
      user.email = email;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User updated!", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  let userObjectId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      if (user._id.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      userObjectId = user._id;
      return User.findByIdAndRemove(userId);
    })
    .then((result) => {
      console.log(userObjectId);
      return Project.deleteMany({ owner: userObjectId });
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted projects." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
