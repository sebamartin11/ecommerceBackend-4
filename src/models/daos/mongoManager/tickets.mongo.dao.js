const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { TicketsModel } = require("../../schemas/tickets.schema");

class TicketsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getTickets() {
    const tickets = await TicketsModel.find().lean();
    return tickets;
  }

  async getTicketById(id) {
    const ticket = await TicketsModel.findOne({ _id: id }).lean();
    return ticket;
  }

  async createTicket(payload) {
    const newTicket = await TicketsModel.create(payload);
    return newTicket;
  }

  async updateTicket(id, payload) {
    const updatedTicket = await TicketsModel.updateOne(
      { _id: id },
      {
        $set: payload,
      }
    );
    return updatedTicket;
  }
}

module.exports = TicketsMongoDao;
