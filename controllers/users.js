const User = require("../models/user");

const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "An error occurred while fetching users" });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(BAD_REQUEST).send({
          message: "User not found",
        });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid user ID format",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error occurred while fetching the user",
      });
    });
};

module.exports = { getUsers, createUser, getUser };
