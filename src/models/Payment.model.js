const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    paymentType: {
      type: String,
      enum: ["KAPORA", "TAKSIT"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payingAmount: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    personPayingTheDeposit: {
      type: String,
      required: true,
    },
    paidEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
