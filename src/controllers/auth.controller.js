import EmployeeModel from "../models/Employee.model";
import messageService from "../services/message.service";
import bcrypt from "bcrypt";

let authController = {
  sendOTP: async (req, res, next) => {
    const { phoneNumber } = req.body;

    try {
      const isExist = await EmployeeModel.findOne({ phoneNumber });

      if (isExist === null) {
        return res
          .status(500)
          .send({ message: "Maalesef, bu çalışan telefonu kayıtlı değildir." });
      }

      const response = await messageService.sendOTP("+905303992093");

      if (response.status !== "pending") {
        return res.status(500).json({
          message: "Doğrulama kodu gönderilemedi.",
        });
      }

      return res.status(200).json({
        message: "Doğrulama kodu gönderildi.",
      });
    } catch (err) {
      next(err);
    }
  },
  verifyAccount: async (req, res, next) => {
    const { phoneNumber, code } = req.body;

    try {
      const isExist = await EmployeeModel.findOne({ phoneNumber });

      if (isExist === null) {
        return res
          .status(500)
          .send({ message: "Maalesef, bu çalışan telefonu kayıtlı değildir." });
      }

      if (isExist.change <= 0) {
        return res.status(500).send({
          message:
            "Maalesef, doğrulama kodu hakkınız bitmiştir. Tekrar talep ediniz.",
        });
      }

      const response = await messageService.checkVerify("+905303992093", code);

      if (!response) {
        return res.status(500).send({
          message:
            "Maalesef, işlemsel bir sıkıntı oluştuğundan kod almayı tekrar deneyiniz.",
        });
      }

      if (response.status !== "approved") {
        await EmployeeModel.findOneAndUpdate(
          { phoneNumber },
          { $inc: { change: -1 } }
        );

        return res.status(500).json({
          message: "Doğrulama kodu hatalıdır. Lütfen tekrar deneyiniz.",
        });
      }

      await EmployeeModel.findOneAndUpdate(
        { phoneNumber },
        { isVerifyAccount: true }
      );

      return res.status(201).json({
        status: true,
        message: "Çalışan telefonu başarı ile doğrulanmıştır.",
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    const { phoneNumber, replyOTP } = req.body;

    try {
      const isExist = await EmployeeModel.findOne({ phoneNumber });

      if (isExist === null) {
        return res
          .status(500)
          .send({ message: "Maalesef, bu çalışan telefonu kayıtlı değildir." });
      }

      if (!isExist.isAccountActive || !isExist.isVerifyAccount) {
        return res.status(500).send({
          message:
            "Hesabınızın aktif olduğundan yada doğrulandığından emin olunuz.",
        });
      }

      if (isExist.change <= 0) {
        return res.status(500).send({
          message:
            "Maalesef, doğrulama kodu hakkınız bitmiştir. Tekrar talep ediniz.",
        });
      }

      const response = await messageService.checkVerify(
        "+905303992093",
        replyOTP
      );

      if (!response) {
        return res.status(500).send({
          message:
            "Maalesef, işlemsel bir sıkıntı oluştuğundan kod almayı tekrar deneyiniz.",
        });
      }

      if (response.status !== "approved") {
        await EmployeeModel.findOneAndUpdate(
          { phoneNumber },
          { $inc: { change: -1 } }
        );

        return res.status(500).json({
          message: "Doğrulama kodu hatalıdır. Lütfen tekrar deneyiniz.",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
