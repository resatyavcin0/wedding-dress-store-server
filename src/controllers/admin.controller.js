//models
import Employee from "../models/Employee.model.js";

//services
import EmployeeService from "../services/employee.service.js";
import MessageService from "../services/message.service.js";

let adminController = {
  createAdmin: async (req, res, next) => {
    try {
      const { firstName, lastName, phoneNumber, password } = req.body;
      const role = "ADMIN";

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
        password,
      });

      return res.status(201).json({
        status: true,
        message: `Kullanıcı başarı ile oluşturuldu.`,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;
