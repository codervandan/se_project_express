const router = require("express").Router();

const {
  createItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CREATE
router.post("/", createItem);

// UPDATE
router.put("/:itemId", updateItem);

// DELETE
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
