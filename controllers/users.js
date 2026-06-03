const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  // FORBIDDEN,
  UNAUTHORIZED,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: "Email already exists",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid user data",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: "User not found",
        });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid user ID format",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Invalid data",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch(() =>
      res.status(UNAUTHORIZED).send({
        message: "Incorrect email or password",
      })
    );
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: "User not found",
        });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid user ID format",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: "User not found",
        });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid user data",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
