const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connecToMongo = require("./db/database");
const logger = require("./config/logger");

const app = express();

app.use("*", cors());
app.use(express.json());

connecToMongo().then(() => {
    app.listen(process.env.PORT, () => {
        logger.info(`server is running port : http://localhost:${process.env.PORT}`);
    })
}).catch((error) => {
    logger.error(`error for server : ${error}`)
})