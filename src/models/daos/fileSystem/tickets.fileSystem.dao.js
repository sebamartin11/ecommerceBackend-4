const fs = require("fs/promises");
const { TicketsModel } = require("../../schemas/tickets.schema");

class TicketsFileSystemDao {
  constructor(path) {
    this.path = path;
  }

  async getTickets() {
    const dataTickets = await fs.readFile(this.path, "utf-8");
    const allTickets = JSON.parse(dataTickets);
    return allTickets;
  }

  async saveTickets(allTickets) {
    await fs.writeFile(this.path, JSON.stringify(allTickets, null, "\t"));
  }

  async getTicketById(id) {
    const allTickets = await this.getTickets();
    const ticketById = allTickets.find((ticket) => ticket._id === id);
    return ticketById;
  }

  async createTicket(payload) {
    const allTickets = await this.getTickets();
    const newTicket = new TicketsModel(payload);
    allTickets.push(newTicket);
    await this.saveTickets(allTickets);
    return newTicket;
  }

  async updateTicket(id, payload) {
    const allTickets = await this.getTickets();
    const ticketIndex = allTickets.findIndex((ticket) => ticket._id === id);

    if (ticketIndex === -1) {
      throw new Error(`Ticket with ID ${id} not found`);
    }

    const updatedTicket = { ...allTickets[ticketIndex], ...payload };
    allTickets[ticketIndex] = updatedTicket;

    await this.saveTickets(allTickets);

    return updatedTicket;
  }
}

module.exports = TicketsFileSystemDao;
