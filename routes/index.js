const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", createUser);
router.post("/signin", login);
// app.post("/signup", createUser);
// app.post("/signin", login);

// router.get("/items", getItems);

module.exports = router;
