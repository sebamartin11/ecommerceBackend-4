const fs = require("fs/promises");

class ChatsFileSystemDao {
  constructor(path) {
    this.path = path;
  }

  async getMessages() {
    try {
      const dataMessages = await fs.readFile(this.path, "utf-8");
      const listMessages = JSON.parse(dataMessages);
      return listMessages;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async saveMessages(listMessages) {
    await fs.writeFile(this.path, JSON.stringify(listMessages, null, "\t"));
  }

  async addMessages(msg) {
    try {
      const data = await this.getMessages();
      const newMsg = {
        user: msg.user,
        message: msg.message,
      };
      data.push(newMsg);
      await this.saveMessages(data);
      return newMsg;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }
}

module.exports = ChatsFileSystemDao;
