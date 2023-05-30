
import express from "express";
import Employee from "../models/Employee.model.js";
import employeeController from "../controller/employee.controller.js"

const router = express.Router();


router.get("/list-normal-employee", async (req, res) => {
  const { isVerify } = req.query;
  try {
    const employees = await Employee.find({
      role: "NORMAL",
      isVerifyAccount: isVerify ? isVerify : false,
    });

    return res.status(201).send({
      message: "Normal kullanıcılar başarı ile getirildi.",
      users: employees,
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(500).send({ errors });
  }
});

router.post("/create-super-user", async (req, res) => {
  const {
    role = "SUPER",
    firstName,
    lastName,
    phoneNumber,
    password,
  } = req.body;

  const isExistEmployee = await Employee.findOne({ phoneNumber });

  if (isExistEmployee) {
    return res
      .status(201)
      .send({ message: "Maalesef bu kullanıcı kayıtlıdır." });
  }

  try {
    await Employee.create({
      role,
      firstName,
      lastName,
      phoneNumber,
      password,
    });

    return res
      .status(201)
      .send({ message: "Süper kullanıcı başarı ile oluşturuldu." });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(500).send({ errors });
  }
});

router.post("/create-user",  employeeController.createUser);

router.get("/bring/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(500).send({
        error: "Böyle bir çalışan bulunmamaktadır.",
      });
    }
    return res.status(200).send({
      message: "Çalışan bilgileri başarı ile getirildi.",
      data: employee,
    });
  } catch (error) {
    return res.status(500).send({
      error:
        "Maalesef, çalışan bilgileri getirme başarısız oldu. Lütfen tekrar deneyiniz.",
      errorReason: error,
    });
  }
});

/**
 
CODE - BASE*/

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(500).send({
        message: "Böyle bir çalışan bulunmamaktadır.",
      });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Çalışan başarı ile silindi.",
      data: deletedEmployee,
    });
  } catch (error) {
    return res.status(500).send({
      error:
        "Maalesef, çalışan bilgileri silme başarısız oldu. Lütfen tekrar deneyiniz.",
      errorReason: error,
    });
  }
});

export default router;