const router = require("express").Router();

const {
  getUsers,
  getCurrentUser,
  updateProfile,
  createUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.post("/", createUser);
router.patch("/me", updateProfile);
module.exports = router;
