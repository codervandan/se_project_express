const User = require("../models/User");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { getUsers };
