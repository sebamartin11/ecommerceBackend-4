const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { UsersModel } = require("../../schemas/users.schema");

class UsersMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getUsers() {
    try {
      const users = await UsersModel.find().lean();
      return users;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async getUserById(id) {
    const user = await UsersModel.findOne({ _id: id }).lean();
    return user;
  }

  async getUserByEmail(email) {
    const user = await UsersModel.findOne({ email }).lean();
    return user;
  }

  async createUser(payload) {
    const newUser = await UsersModel.create(payload);
    return newUser;
  }

  async updateUserByEmail(email, payload) {
    const updatedUser = await UsersModel.updateOne(
      { email },
      {
        $set: payload,
      }
    );
    return updatedUser;
  }

  async updateUserById(id, payload) {
    const updatedUser = await UsersModel.updateOne(
      { _id: id },
      {
        $set: payload,
      }
    );
    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await UsersModel.deleteOne({ _id: id });
    return deletedUser;
  }
}

module.exports = UsersMongoDao;
