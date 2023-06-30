const { MONGO_URI } = require("./env.config");

//Ways to connect to different systems

const DB_CONFIG = {
  fileSystem: {
    products: process.cwd() + "/src/db/files/productsDB.json",
    carts: process.cwd() + "/src/db/files/cartsDB.json",
    chats: process.cwd() + "/src/db/files/chatsDB.json",
    users: process.cwd() + "/src/db/files/usersDB.json",
    tickets: process.cwd() + "/src/db/files/ticketsDB.json",
  },
  mongoDb: {
    uri: MONGO_URI,
  },
};

module.exports = { DB_CONFIG };
