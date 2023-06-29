import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema(
  {
    role: {
      type: "String",
      enum: ["ADMIN", "USER"],
      required: true,
    },
    firstName: {
      type: "String",
      required: true,
    },
    lastName: {
      type: "String",
      required: true,
    },
    phoneNumber: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: [
        function () {
          return this.role === "ADMIN";
        },
      ],
    },
    isVerifyAccount: {
      type: Boolean,
      required: true,
      default: false,
    },
    sid: {
      type: String,
    },
    change: {
      type: Number,
      default: 3,
    },
    isAccountActive: {
      type: Boolean,
      default: function () {
        if (this.role === "ADMIN") {
          return true;
        }
        return false;
      },
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
      },
    ],
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  const user = this;

  if (user.role === "USER") return next();

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashedPassword;

  return next();
});

const EmployeeModel = mongoose.model("Employee", employeeSchema);

export default EmployeeModel;
