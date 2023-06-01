import CostumerModel from "../models/Costumer.model.js";

const isExistCostumer = async ({
  primaryPhoneNumber,
  secondaryPhoneNumber,
}) => {
  const isExist = await CostumerModel.findOne({
    $or: [{ primaryPhoneNumber }, { secondaryPhoneNumber }],
  });

  if (isExist === null) {
    return false;
  }

  return true;
};

const isExistCostumerById = async ({ costumerId }) => {
  const isExist = await CostumerModel.findOne({
    _id: costumerId,
  });

  if (isExist === null) {
    return false;
  }

  return true;
};

const getCostumerList = async () => {
  const costumers = await CostumerModel.find({});
  return costumers;
};

const getCostumerById = async ({ costumerId }) => {
  const costumer = await CostumerModel.findOne({
    _id: costumerId,
  });

  return costumer;
};

export default {
  isExistCostumer,
  isExistCostumerById,
  getCostumerList,
  getCostumerById,
};
