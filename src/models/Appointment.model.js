const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    isItUsed: {
      type: Boolean,
      required: true,
    },
    isItForRent: {
      type: Boolean,
      required: true,
    },
    isPackage: {
      type: Boolean,
      required: true,
    },
    packageDepartureDate: {
      type: Date,
      required: true,
    },
    packageArrivalDate: {
      type: Date,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    firstRehearsalDate: {
      type: Date,
      required: true,
    },
    secondRehearsalDate: {
      type: Date,
    },
    extraNotes: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    costumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "costumer",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointment", appointmentSchema);
