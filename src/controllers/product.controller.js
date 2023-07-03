//models
import Product from "../models/Product.model.js";

let productController = {
  createProduct: async (req, res, next) => {
    const { productName, productCategory } = req.body;

    const product = new Product({
      productName,
      productCategory,
    });

    try {
      const newProduct = await Product.create(product);
      return res
        .status(200)
        .send({ message: "Ürün başarı ile oluşturuldu.", data: newProduct });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ürün oluşturma başarısız oldu. Lütfen tekrar deneyiniz.",
        errorReason: error,
      });
    }
  },
  groupList: async (req, res, next) => {
    const productCategory = req.query.productCategory;

    try {
      const products = await Product.aggregate([
        {
          $match: {
            productCategory: productCategory,
            isReusable: true,
            isSent: false,
          },
        },

        {
          $group: {
            _id: "$_id",
            productName: {
              $push: "$productName",
            },
            count: { $sum: 1 },
          },
        },
      ]);
      return res
        .status(200)
        .send({ message: "Ürünler başarı ile getirildi.", data: products });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ürün getirme başarısız oldu. Lütfen tekrar deneyiniz.",
        errorReason: error,
      });
    }
  },
  productList: async (req, res, next) => {
    const { productCategory, productName } = req.query;

    try {
      const products = await Product.find({
        $or: [{ productCategory }, { productName }],
      });
      return res
        .status(200)
        .send({ message: "Ürünler başarı ile getirildi.", data: products });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ürün getirme başarısız oldu. Lütfen tekrar deneyiniz.",
        errorReason: error,
      });
    }
  },
  deleteProduct: async (req, res, next) => {
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

export default productController;
