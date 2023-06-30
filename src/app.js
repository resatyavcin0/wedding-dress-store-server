import "dotenv/config.js";
import db from "./helpers/db.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//routers
import employeeRouter from "./routers/employee.routes.js";
import adminRouter from "./routers/admin.routes.js";
import costumerRouter from "./routers/costumer.routes.js";
import productRouter from "./routers/product.routes.js";
import appointmentRouter from "./routers/appointment.routes.js";
import paymentRouter from "./routers/payment.routes.js";
import statisticRouter from "./routers/statistic.routes.js";
import authRouter from "./routers/auth.routes.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//health
app.get("/health", (req, res, next) => {
  return res.send("Servis is very health.");
});

app.use("/auth", authRouter);

app.use("/employee", employeeRouter);
app.use("/admin", adminRouter);
app.use("/costumer", costumerRouter);
app.use("/product", productRouter);
app.use("/appointment", appointmentRouter);
app.use("/payment", paymentRouter);
// app.use("/statistic", statisticRouter);

app.listen(process.env.PORT, () => {
  console.log(`The Service listening on ${process.env.PORT} port`);
  db.databaseConnection()
    .then(() => {
      console.log("Database connection is successfull");
    })
    .catch(() => console.log("Database connection err"));
});
