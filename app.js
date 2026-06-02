const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error");
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");

const { PORT = 3001 } = process.env;

const app = express();

app.post("/signup", createUser);
app.post("/signin", login);

app.use(cors());

const { NOT_FOUND } = require("./utils/errors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to MongoDB");
  })
  .catch(() => {
    // console.error("Error connecting to MongoDB:", err);
  });

const routes = require("./routes");

app.use(express.json());

app.use(auth);
app.use(routes);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133",
//   };

//   next();
// });

app.use(routes);

// 404
app.use((req, res, next) => {
  const err = new Error("Requested resource not found");
  err.statusCode = NOT_FOUND;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
