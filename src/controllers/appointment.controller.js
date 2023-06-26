//models
import moment from "moment";
import Appointment from "../models/Appointment.model.js";

//services
import productService from "../services/product.service.js";
import EmployeeModel from "../models/Employee.model.js";
import mongoose from "mongoose";
import CostumerModel from "../models/Costumer.model.js";

let appointmentController = {
  createAppointment: async (req, res, next) => {
    const {
      isItUsed,
      isItForRent,
      isPackage,
      istanbulWedding,
      hasItBeenDelivered,
      packageDepartureDate,
      packageArrivalDate,
      eventDate,
      secondEventDate,
      firstRehearsalDate,
      secondRehearsalDate,
      extraNotes,
      product,
      costumer,
      employee,
    } = req.body;

    let reusableDate, letRealEventDate;

    if (isPackage && istanbulWedding) {
      letRealEventDate = moment(secondEventDate);
      reusableDate = moment(secondEventDate).add(1, "day");
    }
    if (isPackage && !istanbulWedding) {
      letRealEventDate = moment(packageDepartureDate);
      reusableDate = packageArrivalDate;
    }
    if (!isPackage && istanbulWedding) {
      letRealEventDate = moment(eventDate);
      reusableDate = moment(eventDate).add(1, "day");
    }
    if (!isPackage && !istanbulWedding) {
      letRealEventDate = moment(eventDate);
      reusableDate = moment(eventDate).add(2, "day");
    }

    const newAppointment = await Appointment.create({
      isItUsed,
      isItForRent,
      isPackage,
      hasItBeenDelivered,
      packageDepartureDate,
      packageArrivalDate,
      eventDate,
      firstRehearsalDate,
      secondRehearsalDate,
      extraNotes,
      product,
      costumer,
      employee,
    });

    if (isItForRent) {
      await productService.rentTheProduct({
        product,
        reusableDate,
        appointmentId: newAppointment._id,
        letRealEventDate,
      });
    } else {
      await productService.sellTheProduct({
        product,
        appointmentId: newAppointment._id,
        letRealEventDate,
      });
    }

    await EmployeeModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(employee),
      {
        $push: { appointments: newAppointment._id },
      }
    );

    await CostumerModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(costumer),
      {
        $push: { appointments: newAppointment._id },
      }
    );

    try {
      return res.status(201).json({
        status: true,
        message: `Randevu başarı ile oluşturuldu`,
      });
    } catch (err) {
      next(err);
    }
  },
  cancelAppointment: async (req, res, next) => {
    try {
      const { appointmentId } = req.params;
      const isExist = await Appointment.findOne({
        _id: appointmentId,
      });

      if (isExist === null) {
        return res.status(500).send({
          error: "Maalesef, bu randevu kayıtlı değildir.",
        });
      }

      const deletedAppointment = await Appointment.findOneAndDelete({
        _id: appointmentId,
      });

      if (isExist.isItForRent) {
        await productService.rentProductCancel(isExist.product, appointmentId);
      } else {
        await productService.sellProductCancel(isExist.product, appointmentId);
      }

      await EmployeeModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(isExist.employee),
        {
          $pull: { appointments: appointmentId },
        }
      );

      await CostumerModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(isExist.costumer),
        {
          $pull: { appointments: appointmentId },
        }
      );

      return res.status(200).send({
        message: "Randevu bilgileri başarı ile silindi.",
        deletedAppointment,
      });
    } catch (err) {
      next(err);
    }
  },
  viewAppointmentByCostumer: async (req, res, next) => {
    try {
      const { costumerId } = req.params;
      const isExist = await CostumerModel.findOne({
        _id: costumerId,
      }).populate("appointments");

      if (isExist === null) {
        return res.status(500).send({
          error: "Maalesef, bu müşteri kayıtlı değildir.",
        });
      }

      return res.status(200).send({
        message: "Kullanıcı bazlı randevu bilgileri başarı ile getirildi.",
        data: isExist,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default appointmentController;
