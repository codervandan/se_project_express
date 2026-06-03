const router = require("express").Router();

// const auth = require("../middlewares/auth");
const auth = require("../middlewares/auth");

const userRouter = require("./users");

const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItem");

const clothingItemRouter = require("./clothingItem");


router.post("/signup", createUser);
router.post("/signin", login);

router.get('/', getItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);



module.exports = router;
