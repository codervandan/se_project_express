const ClothingItem = require("../models/clothingItem");

const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// CREATE
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid data passed when creating item",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

// READ
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

// UPDATE
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { imageUrl },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid data passed when updating item",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid item ID",
        });
      }

      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({
          message: "Item not found",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

// DELETE
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid item ID",
        });
      }

      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({
          message: "Item not found",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server.",
      });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
