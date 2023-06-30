const mongoose = require("mongoose");

const ticketcollection = "tickets";
const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: String, required: true },
  purchaser: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        amount: {
          type: Number,
        },
      },
    ],
    required: true,
  },
});

module.exports = {
  TicketsModel: mongoose.model(ticketcollection, ticketSchema),
};
