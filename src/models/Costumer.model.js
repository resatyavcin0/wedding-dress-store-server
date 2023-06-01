const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const costumerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    primaryPhoneNumber: {
      type: String,
      required: true,
    },
    secondaryPhoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
      },
    ],
  },
  { timestamps: true }
);

const CostumerModel = mongoose.model("costumer", costumerSchema);

export default CostumerModel;
