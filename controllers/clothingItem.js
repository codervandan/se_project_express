const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const { NOT_FOUND } = require("../utils/errors");

// CREATE
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid item data"));
      }

      return next(new BadRequestError("An error has occurred on the server."));
    });
};

// READ
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => next(err));
};

// DELETE
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError("Forbidden"));
      }

      return item.deleteOne().then(() => {
        res.send(item);
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }

      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Item not found"));
      }

      return next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }

      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Item not found"));
      }

      return next(new BadRequestError("An error has occurred on the server."));
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }

      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Item not found"));
      }

      return next(new BadRequestError("An error has occurred on the server."));
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
