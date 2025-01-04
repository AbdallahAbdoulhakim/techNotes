import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const roles = {
  Employee: 1100,
  Manager: 2200,
  Admin: 3300,
};

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      enum: Object.values(roles),
      default: [roles.Employee],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model("User", userSchema);
