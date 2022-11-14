const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const ApiError = require("./errors/apiError");

const app = express();

// setup middlewares
app.use(express.json({}));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// setup routes
const router = require("./routes/index");
app.use("", router);

// setup page not found
app.all("*", (req, res, next) => {
  next(new ApiError(`page not found for this url : ${req.originalUrl}`, 404));
});

// setup error handler
const globalErrorMiddleware = require("./middlewares/globalError");
app.use(globalErrorMiddleware);

// start server and db connection
const dbConnection = require("./config/db");
const { urlencoded } = require("express");
const PORT = process.env.SERVER_PORT || 7000;
dbConnection().then((conn) => {
  app.listen(PORT, () => {
    console.log(
      `server run successfully on port ${PORT} and database on host ${conn.connection.host}`
    );
  });
});

// handle rejections outer express
process.on("unhandledRejection", (err) => {
  console.log(`unhandeled rejection with error : ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
