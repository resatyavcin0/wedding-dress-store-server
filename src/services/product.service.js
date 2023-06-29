const { ObjectId } = require("bson");
import ProductModel from "../models/Product.model";

const rentTheProduct = async ({
  product,
  reusableDate,
  appointmentId,
  letRealEventDate,
  session,
}) => {
  try {
    await ProductModel.findByIdAndUpdate(product, {
      isReusable: false,
      reusableDate,
      $push: {
        history: {
          type: "KIRALIK",
          date: letRealEventDate,
          appointment: appointmentId,
        },
      },
    }).session(session);
  } catch (error) {
    console.log(error);
  }
};
const receivingTheProduct = async (product) => {
  try {
    await ProductModel.findByIdAndUpdate(product, {
      isReusable: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const rentProductCancel = async (product, appointmentId) => {
  await ProductModel.findByIdAndUpdate(
    product,
    {
      isReusable: true,
      $set: {
        "history.$[y].isActive": false,
      },
    },
    {
      arrayFilters: [
        {
          "y.appointment": new ObjectId(appointmentId),
        },
      ],
    }
  );
};

const sellTheProduct = async ({
  product,
  appointmentId,
  letRealEventDate,
  session,
}) => {
  try {
    await ProductModel.findByIdAndUpdate(product, {
      isSent: true,
      isReusable: false,

      $push: {
        history: {
          type: "SATILIK",
          date: letRealEventDate,
          appointment: appointmentId,
        },
      },
    }).session(session);
  } catch (error) {
    console.log(error);
  }
};
const sellProductCancel = async (product, appointmentId) => {
  try {
    await ProductModel.findByIdAndUpdate(
      product,
      {
        isSent: false,
        isReusable: true,
        $set: {
          "history.$[y].isActive": false,
        },
      },
      {
        arrayFilters: [
          {
            "y.appointment": new ObjectId(appointmentId),
          },
        ],
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default {
  rentTheProduct,
  receivingTheProduct,
  rentProductCancel,
  sellTheProduct,
  sellProductCancel,
};
