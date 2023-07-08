//models
import ProductModel from "../models/Product.model.js";
import Product from "../models/Product.model.js";
import productService from "../services/product.service.js";

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
  receivePatch: async (req, res, next) => {
    const { productId, historyId } = req.params;
    console.log(req.params);
    try {
      await productService.receivingTheProduct(productId, historyId);
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
  getById: async (req, res, next) => {
    try {
      const id = req.params.id;

      const product = await ProductModel.findById(id).populate({
        path: "history",
        populate: {
          path: "appointment",
        },
      });
      return res.status(200).send({
        message: "Product bilgileri başarı ile silindi.",
        data: product,
      });
    } catch (error) {
      return res.status(500).send({
        error:
          "Maalesef, ürün getirme başarısız oldu. Lütfen tekrar deneyiniz.",
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
    const productCategory = req.query.productCategory;

    try {
      const products = await Product.find({ productCategory });
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
