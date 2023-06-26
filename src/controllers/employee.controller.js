//models
import Employee from "../models/Employee.model.js";

//services
import EmployeeService from "../services/employee.service.js";
import MessageService from "../services/message.service.js";

let employeeController = {
  createUser: async (req, res, next) => {
    try {
      const { firstName, lastName, phoneNumber } = req.body;
      const role = "USER";

      const isExist = await EmployeeService.isExistUser({ phoneNumber });

      if (isExist) {
        return res
          .status(201)
          .send({ message: "Maalesef, bu kullanıcı kayıtlıdır." });
      }

      await Employee.create({
        role,
        firstName,
        lastName,
        phoneNumber,
      });

      const isSend = await MessageService.fakeSendOtpPromise();

      let messageAboutTheReturnOfTheMessagePromise = isSend
        ? "Başarı ile mesaj kullanıcıya iletildi."
        : "Kullanıcıya mesaj gönderilemedi. Lütfen tekrar gönder tuşuna basınız.";

      return res.status(201).json({
        status: true,
        message: `Kullanıcı başarı ile oluşturuldu ve ${messageAboutTheReturnOfTheMessagePromise}`,
      });
    } catch (err) {
      next(err);
    }
  },
  getUserListWithUserRole: async (req, res, next) => {
    try {
      const { isVerifyAccount, isAccountActive } = req.query;
      const userList = await EmployeeService.getUsersByProperties({
        isAccountActive,
        isVerifyAccount,
      });

      return res.status(200).send({
        message: "Kullanıcılar başarı ile getirildi.",
        users: userList,
      });
    } catch (err) {
      next(err);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const isExist = await EmployeeService.isExistUser({ userId });

      if (!isExist) {
        return res.status(500).send({
          error: "Maalesef, bu kullanıcı kayıtlı değildir.",
        });
      }

      const user = await EmployeeService.getUserById({ userId });
      return res.status(200).send({
        message: "Çalışan bilgileri başarı ile getirildi.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteUserById: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const isExist = await EmployeeService.isExistUser({ userId });

      if (!isExist) {
        return res.status(500).send({
          error: "Maalesef, bu kullanıcı kayıtlı değildir.",
        });
      }

      if (!isExist.appointments.length === 0) {
        return res.status(200).send({
          message:
            "Çalışan silinemez. Çünkü bağlı olduğu randevular vardır. İlk önce onları silmeniz gerekmektedir.",
          data: costumer,
        });
      }

      const deletedUser = await EmployeeService.deleteUserById({ userId });

      if (!deletedUser) {
        return res.status(500).send({
          message: "Çalışan bulunamamaktadır.",
        });
      }

      return res.status(200).send({
        message: "Çalışan bilgileri başarı ile silindi.",
        deletedUser,
      });
    } catch (err) {
      next(err);
    }
  },
  updateUserById: async (req, res, next) => {
    const { firstName, lastName, phoneNumber } = req.body;
    const userId = req.params.userId;
    try {
      const isExist = await EmployeeService.isExistUser({ userId });

      if (!isExist) {
        return res.status(500).send({
          error: "Maalesef, bu kullanıcı kayıtlı değildir.",
        });
      }

      const updatedUser = await Employee.findByIdAndUpdate(
        { _id: userId },
        { firstName, lastName, phoneNumber }
      );

      if (!updatedUser) {
        return res.status(500).send({
          message: "Çalışan bulunamamaktadır.",
        });
      }

      return res.status(200).send({
        message: "Çalışan bilgileri başarı ile güncellendi.",
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default employeeController;
