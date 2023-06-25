import "dotenv/config.js";
import db from "./helpers/db.js";

import express from "express";
import bodyParser from "body-parser";

//routers
import employeeRouter from "./routers/employee.routes.js";
import adminRouter from "./routers/admin.routes.js";
import costumerRouter from "./routers/costumer.routes.js";
import productRouter from "./routers/product.route.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//health
app.get("/health", (req, res, next) => {
  return res.send("Servis is very health.");
});

app.use("/employee", employeeRouter);
app.use("/admin", adminRouter);
app.use("/costumer", costumerRouter);
app.use("/product", productRouter);

app.listen(process.env.PORT, () => {
  console.log(`The Service listening on ${process.env.PORT} port`);
  db.databaseConnection()
    .then(() => {
      console.log("Database connection is successfull");
    })
    .catch(() => console.log("Database connection err"));
});
