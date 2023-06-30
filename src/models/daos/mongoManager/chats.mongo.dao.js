const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { MessagesModel } = require("../../schemas/chat.schema");

class ChatsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getMessages() {
    try {
      const listMessages = await MessagesModel.find().lean();
      return listMessages;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addMessages(msg) {
    try {
      const newMsg = await MessagesModel.create(msg);
      return newMsg;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }
}

module.exports = ChatsMongoDao;
