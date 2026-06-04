const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error");
const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

const { NOT_FOUND } = require("./utils/errors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

app.use((req, res, next) => {
  const err = new Error("Requested resource not found");
  err.statusCode = NOT_FOUND;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {});
