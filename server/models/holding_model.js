const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const holdingSchema = new Schema({

     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },

  symbol: {
    type: String,
    required: true,
    uppercase: true
  },

  quantity: {
    type: Number,
    default: 0
  },

  averageBuyPrice: {
    type: Number,
    default: 0
  }

}, { timestamps: true },);
holdingSchema.index(
  { user: 1, symbol: 1 },
  { unique: true });

  module.exports = mongoose.model("Holding", holdingSchema);