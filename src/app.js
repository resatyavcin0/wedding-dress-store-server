// require("dotenv").config("./.env");
// require("./helpers/db").databaseConnection();
import "dotenv/config.js";
import db from "./helpers/db.js";

import employeeRouter from "./routers/employee.router.js"



const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//health
app.get("/health", (req, res, next) => {
    return res.send("Servis is very health.");
});

//routers

// const productRouter = require("./src/routers/product.router");
// const costumerRouter = require("./src/routers/costumer.router");
// const paymentRouter = require("./src/routers/payment.router");
// const appointmentRouter = require("./src/routers/appointment.router");

app.use("/employee", employeeRouter);
// app.use("/product", productRouter);
// app.use("/costumer", costumerRouter);
// app.use("/payment", paymentRouter);
// app.use("/appointment", appointmentRouter);

app.listen(process.env.PORT, () => {
    console.log(`The Service listening on ${process.env.PORT} port`);
    db.databaseConnection().then(() => {
        console.log("Database connection is successfull")
    }).catch(()=>console.log("Database connection err"))
});