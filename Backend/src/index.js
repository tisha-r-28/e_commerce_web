const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xssClean = require("xss-clean");

const connecToMongo = require("./db/database");
const logger = require("./config/logger");
const routes = require("./routes/index");
const apiResponse = require("./utils/api.response");
const message = require("./json/messages.json");

const app = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

connecToMongo().then(() => {
    app.listen(process.env.PORT, () => {
        logger.info(`server is running port : http://localhost:${process.env.PORT}`);
    })
}).catch((error) => {
    logger.error(`error for server : ${error}`)
})


app.options("*", cors());
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//use to set headers
app.use(helmet());
app.use(xssClean()); 

app.use("/api/v1", routes);

app.use((req, res, next) => {
  return apiResponse.NOT_FOUND({ res, message: message.route_not_found })
});