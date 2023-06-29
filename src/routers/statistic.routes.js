import express from "express";
import AppointmentModel from "../models/Appointment.model";
import moment from "moment";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const beforeAWeek = moment(new Date()).add(-7, "days").format();
  //   const appointmentIncrease = await AppointmentModel.aggregate([
  //     {
  //       $match: {
  //         createdAt: { $gte: beforeAWeek },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$_id",
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);

  res.send({
    data: [
      {
        title: "Kazanç",
        statisticType: "string",
        id: "earning",
        direction: null,
        // value: amountOfEarnings?.toString(),
      },
      {
        title: "Randevu Verilme Artışı",
        statisticType: "string",
        id: "appointmentIncrease",
        direction: "down",
        value: "12.98",
      },
      {
        title: "Randevu Türlerinin Oranı",
        statisticType: "array",
        id: "ratioAppointmentTypes",
        direction: null,
        value: [
          {
            name: "GELİNLİK",
            value: 20,
          },
          {
            name: "NİŞANLIK",
            value: 40,
          },
          {
            name: "KINALIK",
            value: 40,
          },
        ],
      },
      {
        title: "Çalışanın Verdiği Randevu Sayısı",
        statisticType: "array",
        id: "employeePerformance",
        direction: null,
        value: [
          {
            name: "Ebru Mert",
            value: "0",
          },
          {
            name: "Perihan Salaş",
            value: "3",
          },
          {
            name: "Suna Arslan",
            value: "3",
          },
        ],
      },
    ],
  });
});

export default router;
