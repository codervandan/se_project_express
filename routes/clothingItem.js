const router = require("express").Router();

const {
  createItem,
<<<<<<< HEAD
  getItems,
=======
>>>>>>> 755c40992ac40e52a7762e0a1dd091658f38b9a5
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CREATE
router.post("/", createItem);

<<<<<<< HEAD
=======

>>>>>>> 755c40992ac40e52a7762e0a1dd091658f38b9a5
// DELETE
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.get("/", getItems);

module.exports = router;
