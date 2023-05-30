import { set } from 'mongoose';
import Employee from "../models/Employee.model.js";


// fake promise
const fakeSendOtpPromise = () => {
    return new Promise(resolve => setTimeout(resolve(true), 500));
}

//create user 
let employeeController = {
    createUser: async (req, res, next) => {
        try {

            const { firstName, lastName, phoneNumber } = req.body;
            const role = "USER"

            const isExistEmployee = await Employee.findOne({ phoneNumber });

            if (isExistEmployee) {
                return res
                    .status(201)
                    .send({ message: "Maalesef bu kullanıcı kayıtlıdır." });
            }

            const createdEmployee = await Employee.create({
                role,
                firstName,
                lastName,
                phoneNumber,
            });


            const responseByOtpService = await fakeSendOtpPromise()

            console.log(responseByOtpService)

            if (!responseByOtpService) {
                res.status(500).json({ status: false, err: "otp err" })
            }

            return res.status(201).json({ status: true, message: "Normal kullanıcı başarı ile oluşturuldu." });
        } catch (err) {
            next(err)
        }
    }
}

export default employeeController;