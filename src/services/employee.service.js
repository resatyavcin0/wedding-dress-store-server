import EmployeeModel from "../models/Employee.model.js";

const isExistUser = async ({ phoneNumber, userId }) => {
  const isExist = await EmployeeModel.findOne({
    $or: [{ phoneNumber }, { _id: userId }],
  });

  if (isExist === null) {
    return false;
  }

  return isExist;
};

const getUsersByProperties = async ({ isVerifyAccount, isAccountActive }) => {
  const employees = await EmployeeModel.find({
    role: "USER",
    isVerifyAccount: isVerifyAccount ?? false,
    isAccountActive: isAccountActive ?? false,
  });

  return employees;
};

const getUserById = async ({ userId }) => {
  const employees = await EmployeeModel.findOne({
    _id: userId,
  });

  return employees;
};

const deleteUserById = async ({ userId }) => {
  const deletedUser = await EmployeeModel.findOneAndRemove({
    role: "USER",
    _id: userId,
  });

  if (deletedUser === null) {
    return false;
  }

  return deletedUser;
};

export default {
  isExistUser,
  getUserById,
  getUsersByProperties,
  deleteUserById,
};
