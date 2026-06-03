const router = require("express").Router();

// const auth = require("../middlewares/auth");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
