const router = require("express").Router();

const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

// CREATE
router.post("/", validateClothingItem, createItem);

// DELETE
router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
