const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./utils/errors/NotFoundError");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };

  next();
});

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(err.statusCode || 500).send({
//     message: err.message || "An error occurred on the server",
//   });
// });

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
