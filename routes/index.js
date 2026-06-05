const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItem");

router.post("/signup", createUser);
router.post("/signin", login);

router.get("/items", getItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
