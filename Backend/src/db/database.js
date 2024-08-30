require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../config/logger");

const mongo_URI = process.env.MONGO_URI;
console.log(mongo_URI, "mongo");

const connecToMongo = async () => {
    try {
        await mongoose.connect(mongo_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        logger.info("✔ connected to mongoDB sucessfully!")
    } catch (error) {
        logger.error(`❌ error for mongoDB connection : ${error.message}`)
    }
}

module.exports = connecToMongo;