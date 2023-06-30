const { v4: uuid } = require("uuid");

class TicketDTO {
  constructor(purchaser, amount, products) {
    this.products = products;
    this.purchaser = purchaser;
    this.amount = amount;
    this.purchase_datetime = new Date().toLocaleDateString();
    this.code = uuid();
  }
}

module.exports = { TicketDTO };
