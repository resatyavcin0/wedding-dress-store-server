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
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      enum: ["KINALIK", "GELINLIK", "NISANLIK"],
      required: true,
    },
    history: {
      type: [
        {
          sentOrRent: {
            type: String,
            enum: ["KIRALIK", "SATILIK"],
          },
          date: {
            type: Date,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
