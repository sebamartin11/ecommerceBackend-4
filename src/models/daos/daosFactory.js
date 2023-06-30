const { DB_CONFIG } = require("../../config/db.config");
const { PERSISTENCE } = require("../../config/env.config");
const { logger } = require("../../logger/logger");

let productsDao;

let cartsDao;

let chatsDao;

let ticketsDao;

let usersDao;

logger.debug(`Using "${PERSISTENCE}" as persistence`);

switch (PERSISTENCE) {
  case "FILES": {
    const ProductsFileSystemDao = require("./fileSystem/products.fileSystem.dao");
    const CartsFileSystemDao = require("./fileSystem/carts.fileSystem.dao");
    const ChatsFileSystemDao = require("./fileSystem/chats.fileSystem.dao");
    const TicketsFileSystemDao = require("./fileSystem/tickets.fileSystem.dao");
    const UsersFileSystemDao = require("./fileSystem/users.fileSystem.dao");

    productsDao = new ProductsFileSystemDao(DB_CONFIG.fileSystem.products);
    cartsDao = new CartsFileSystemDao(DB_CONFIG.fileSystem.carts, productsDao);
    chatsDao = new ChatsFileSystemDao(DB_CONFIG.fileSystem.chats);
    ticketsDao = new TicketsFileSystemDao(DB_CONFIG.fileSystem.tickets);
    usersDao = new UsersFileSystemDao(DB_CONFIG.fileSystem.users);

    break;
  }

  case "MONGO": {
    const ProductsMongoDao = require("./mongoManager/products.mongo.dao");
    const CartsMongoDao = require("./mongoManager/carts.mongo.dao");
    const ChatsMongoDao = require("./mongoManager/chats.mongo.dao");
    const TicketsMongoDao = require("./mongoManager/tickets.mongo.dao");
    const UsersMongoDao = require("./mongoManager/users.mongo.dao");

    productsDao = new ProductsMongoDao();
    cartsDao = new CartsMongoDao();
    chatsDao = new ChatsMongoDao();
    ticketsDao = new TicketsMongoDao();
    usersDao = new UsersMongoDao();

    break;
  }

  default: {
    logger.fatal("An invalid persistence method was provided");
    throw new Error("Please provide a valid persistence method");
  }
}

const getDAOS = () => {
  return {
    productsDao,
    cartsDao,
    chatsDao,
    ticketsDao,
    usersDao,
  };
};

module.exports = { getDAOS };
