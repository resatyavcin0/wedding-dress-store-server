import EmployeeModel from "../models/Employee.model";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = require("twilio")(accountSid, authToken);

const sendOTP = async (phone) => {
  const response = await client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: "sms" })
    .then((verification) => verification)
    .catch((err) => console.log(err));

  return response;
};

const checkVerify = async (phone, code) => {
  try {
    const response = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: code })
      .then((verification_check) => verification_check);

    return response;
  } catch (err) {
    console.log(err);
  }
};

export default {
  sendOTP,
  checkVerify,
};
