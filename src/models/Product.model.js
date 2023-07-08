import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    isSent: {
      type: Boolean,
      required: true,
      default: false,
    },
    isReusable: {
      type: Boolean,
      required: true,
      default: true,
    },
    reusableDate: {
      type: Date,
    },
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      enum: ["KINALIK", "GELINLIK", "NISANLIK"],
      required: true,
    },
    history: [
      {
        type: {
          type: String,
          enum: ["KIRALIK", "SATILIK"],
        },
        date: {
          type: Date,
          required: true,
        },
        appointment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "appointment",
        },
        isActive: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
