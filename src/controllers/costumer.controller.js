//models
import Costumer from "../models/Costumer.model.js";
import costumerService from "../services/costumer.service.js";

let costumerController = {
  createCostumer: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        primaryPhoneNumber,
        secondaryPhoneNumber,
      } = req.body;

      const isExist = await costumerService.isExistCostumer({
        primaryPhoneNumber,
        secondaryPhoneNumber,
      });

      if (isExist) {
        return res
          .status(201)
          .send({ message: "Maalesef, bu müşteri telefonu kayıtlıdır." });
      }

      await Costumer.create({
        firstName,
        lastName,
        address,
        primaryPhoneNumber,
        secondaryPhoneNumber,
      });

      return res.status(201).json({
        status: true,
        message: "Müşteri başarı ile oluşturulmuştur.",
      });
    } catch (err) {
      next(err);
    }
  },
  getCostumerList: async (req, res, next) => {
    try {
      const costumerList = await costumerService.getCostumerList();

      return res.status(200).send({
        message: "Müşteriler başarı ile getirildi.",
        costumers: costumerList,
      });
    } catch (err) {
      next(err);
    }
  },
  getCostumerById: async (req, res, next) => {
    try {
      const costumerId = req.params.costumerId;
      const isExist = await costumerService.isExistCostumerById({
        costumerId,
      });

      if (!isExist) {
        return res.status(500).send({
          error: "Maalesef, bu kullanıcı kayıtlı değildir.",
        });
      }

      const costumer = await costumerService.getCostumerById({ costumerId });

      return res.status(200).send({
        message: "Müşteri bilgileri başarı ile getirildi.",
        data: costumer,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteCostumer: async (req, res, next) => {
    try {
      const costumerId = req.params.costumerId;
      const isExist = await costumerService.isExistCostumerById({
        costumerId,
      });

      if (!isExist) {
        return res.status(500).send({
          error: "Maalesef, bu kullanıcı kayıtlı değildir.",
        });
      }

      if (!isExist.appointments.length === 0) {
        return res.status(200).send({
          message:
            "Müşteri silinemez. Çünkü bağlı olduğu randevular vardır. İlk Önce onları silmeniz gerekmektedir.",
          data: costumer,
        });
      }

      const costumer = await Costumer.findByIdAndDelete(costumerId);
      return res.status(200).send({
        message: "Müşteri bilgileri başarı ile silindi.",
        data: costumer,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default costumerController;
