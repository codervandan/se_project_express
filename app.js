const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const routes = require("./routes");

app.use(express.json());

app.use(routes);

// 404
app.use((req, res, next) => {
  const err = new Error("Requested resource not found");
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
