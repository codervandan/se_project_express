const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   SERVER_ERROR,
//   CONFLICT,
//   // FORBIDDEN,
//   UNAUTHORIZED,
// } = require("../utils/errors");

// POST /users
const createUser = (req, res, next) => {
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
        return next(new ConflictError("Email already exists"));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }

      return next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }

      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Invalid data"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }

      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }

      return next(err);
    });
};

module.exports = {
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
