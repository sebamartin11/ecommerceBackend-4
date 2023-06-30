const mongoose = require("mongoose");
const { DB_CONFIG } = require("../../config/db.config");
const { logger } = require("../../logger/logger");
const { PERSISTENCE } = require("../../config/env.config");

//connect with the database with SINGLETON METHOD

class MongoDbConnection {
  static #instance;
  constructor() {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(DB_CONFIG.mongoDb.uri)
      .then(() => {
        logger.info("Database connection successful");
      })
      .catch((error) => {
        logger.fatal("Database connection error");
        throw error;
      });
  }
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoDbConnection();
    }
    return this.#instance;
  }
}

module.exports = {
  MongoDbConnection,
};
