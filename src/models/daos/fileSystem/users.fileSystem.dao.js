const fs = require("fs/promises");
const { UsersModel } = require("../../schemas/users.schema");

class UsersFileSystemDao {
  constructor(path, cartsDao) {
    this.path = path;
    this.cartsDao = cartsDao;
  }
  async getUsers() {
    const dataUsers = await fs.readFile(this.path, "utf-8");
    const allUsers = JSON.parse(dataUsers);
    return allUsers;
  }

  async saveUsers(allUsers) {
    await fs.writeFile(this.path, JSON.stringify(allUsers, null, "\t"));
  }

  async getUserById(id) {
    const allUsers = await this.getUsers();
    const userById = allUsers.find((user) => user._id === id);
    return userById;
  }

  async getUserByEmail(email) {
    const allUsers = await this.getUsers();
    const userByEmail = allUsers.find((user) => user.email === email);
    return userByEmail;
  }

  async createUser(payload) {
    const allUsers = await this.getUsers();
    const newCart = await this.cartsDao.addCart();
    const newUser = {
      ...payload,
      newCart,
    };
    const createUser = new UsersModel(newUser);
    allUsers.push(createUser);
    await this.saveUsers(allUsers);
    return newUser;
  }

  async updateUser(id, payload) {
    const allUsers = await this.getUsers();
    const userById = await this.getUserById(id);

    const newUserProperties = { ...userById, ...payload };

    const updatedUser = allUsers.map((user) => {
      if (user._id === newUserProperties._id) {
        return newUserProperties;
      } else {
        return user;
      }
    });

    await this.saveUsers(updatedUser);

    return updatedUser;
  }

  async deleteUser(id) {
    const allUsers = await this.getUsers();
    const filteredById = allUsers.filter((user) => user._id !== id);
    await this.saveUsers(filteredById);
    return filteredById;
  }
}

module.exports = UsersFileSystemDao;
