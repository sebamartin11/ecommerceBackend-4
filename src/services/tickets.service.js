const { getDAOS } = require("../models/daos/daosFactory");

const { ticketsDao } = getDAOS();

class TicketService {
  async generateTicket(order) {
    const newTicket = await ticketsDao.createTicket(order);
    return newTicket;
  }
}

module.exports = { TicketService };
