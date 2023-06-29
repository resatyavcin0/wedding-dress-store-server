//models

import PaymentModel from "../models/Payment.model";

let paymentController = {
  createPayment: async (req, res, next) => {
    let paymentType = null;

    const {
      totalAmount,
      payingAmount,
      remainingAmount,
      personPayingTheDeposit,
      paidEmployee,
      appointment,
    } = req.body;

    try {
      const isExist = await PaymentModel.findOne({ appointment });

      if (isExist !== null) {
        paymentType = "TAKSIT";
      }

      const payment = new PaymentModel({
        paymentType: paymentType ?? "KAPORA",
        totalAmount,
        payingAmount,
        remainingAmount,
        personPayingTheDeposit,
        paidEmployee,
        appointment,
      });

      return res
        .status(200)
        .send({ message: "Ödeme başarı ile oluşturuldu.", data: payment });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ödeme oluşturma başarısız oldu. Lütfen tekrar deneyiniz.",
        errorReason: error,
      });
    }
  },
  deletePayment: async (req, res, next) => {
    const id = req.params.id;

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(500).send({
          error: "Böyle bir ürün bulunmamaktadır.",
        });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      return res.status(200).send({
        message: "Ürün başarı ile silindi.",
        data: deletedProduct,
      });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ürün getirme başarısız oldu. Lütfen tekrar deneyiniz.",
        errorReason: error,
      });
    }
  },
};

export default paymentController;
