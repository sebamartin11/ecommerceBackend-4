const { MessagesService } = require("./messages.service");
const { TicketService } = require("./tickets.service");

const ticketService = new TicketService();
const messagesService = new MessagesService();

const getServices = () => {
  return {
    ticketService,
    messagesService,
  };
};

module.exports = { getServices };
