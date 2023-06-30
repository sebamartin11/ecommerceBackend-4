const { Server } = require("socket.io");
const { getDAOS } = require("../models/daos/daosFactory");
const { logger } = require("../logger/logger");

const { chatsDao } = getDAOS();

// SOCKET

module.exports = (app, httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    logger.debug("New client connected");
    app.set("socket", socket);

    const getChats = async () => {
      const msg = await chatsDao.getMessages();
      socket.emit("message-logs", msg);
    };

    socket.on("login", async (user) => {
      await getChats();
      socket.emit("welcome", user);
      socket.broadcast.emit("new-user", user);
    });

    socket.on("message", async (data) => {
      await chatsDao.addMessages(data);
      const msg = await chatsDao.getMessages();
      io.emit("message-logs", msg);
    });
  });
};
