const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productCount: {
      type: Number,
      required: true,
    },
    productCategory: {
      type: String,
      enum: ["KINALIK", "GELINLIK", "NISANLIK"],
      required: true,
    },
    leasedDates: [
      {
        appointment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "appointment",
        },
        date: Date,
        isArrival: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    soldDates: [
      {
        appointment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "appointment",
        },
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
