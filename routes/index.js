const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
<<<<<<< HEAD
const clothingItemRouter = require("./clothingItem");
=======

>>>>>>> 755c40992ac40e52a7762e0a1dd091658f38b9a5
const { createUser, login } = require("../controllers/users");

const clothingItemRouter = require("./clothingItem");


router.post("/signup", createUser);
router.post("/signin", login);


router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);



module.exports = router;
