import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const configurationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique:true
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      unique:true
    },
    phone: {
      type: String,
      unique:true
    },
    logo: {
      type: String,
      unique:true
    },
  },
  { timestamps: true }
);
const Configuration = mongoose.model("setting", configurationSchema);
export default Configuration;
