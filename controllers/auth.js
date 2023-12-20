const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation error.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const surname = req.body.surname;
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        name: name,
        surname: surname,
        role: role,
        email: email,
        password: hashedPw,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email does not exist");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password entered");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, "somesupersecretsecret", { expiresIn: "1h" });
      const userToSend = loadedUser;
      userToSend.password = undefined;

      res.status(200).json({ token: token, user: userToSend });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error("Error login");
        error.statusCode = 500;
        throw error;
      }
      next(err);
    });
};
