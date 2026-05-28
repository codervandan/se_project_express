const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/clothingItems");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItem");

// CREATE
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPDATE
router.put("/:itemId", updateItem);

// DELETE
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
