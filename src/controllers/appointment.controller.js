//models
import moment from "moment";
import Appointment from "../models/Appointment.model.js";
const { ObjectId } = require("bson");

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
    let session;

    try {
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

      session = await mongoose.startSession();
      session.startTransaction();

      const newAppointment = await Appointment.create(
        [
          {
            isItUsed: isItUsed,
            isItForRent: isItForRent,
            isPackage: isPackage,
            hasItBeenDelivered: hasItBeenDelivered,
            packageDepartureDate: packageDepartureDate,
            packageArrivalDate: packageArrivalDate,
            eventDate: eventDate,
            firstRehearsalDate: firstRehearsalDate,
            secondRehearsalDate: secondRehearsalDate,
            extraNotes: extraNotes,
            product: product,
            costumer: costumer,
            employee: employee,
          },
        ],
        { session: session }
      );

      if (isItForRent) {
        await productService.rentTheProduct({
          product,
          reusableDate,
          appointmentId: new mongoose.Types.ObjectId(newAppointment._id),
          letRealEventDate,
          session,
        });
      } else {
        await productService.sellTheProduct({
          product,
          appointmentId: new mongoose.Types.ObjectId(newAppointment._id),
          letRealEventDate,
          session,
        });
      }

      await EmployeeModel.findByIdAndUpdate(employee, {
        $push: {
          appointments: new mongoose.Types.ObjectId(newAppointment._id),
        },
      }).session(session);

      await CostumerModel.findByIdAndUpdate(costumer, {
        $push: {
          appointments: new mongoose.Types.ObjectId(newAppointment._id),
        },
      }).session(session);

      await session?.commitTransaction();

      return res.status(201).json({
        status: true,
        message: `Randevu başarı ile oluşturuldu`,
      });
    } catch (err) {
      await session?.abortTransaction();
      next(err);
    } finally {
      session?.endSession();
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
};

export default appointmentController;
