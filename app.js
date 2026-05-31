const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error");

const { BAD_REQUEST } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

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

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };

  next();
});

app.use(routes);

// 404
app.use((req, res, next) => {
  const err = new Error("Requested resource not found");
  err.statusCode = BAD_REQUEST;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
