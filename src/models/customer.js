import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const customerSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    logins: {
      type: Number,
      default:0
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

customerSchema.virtual("reservations", {
  ref: "reservation",
  localField: "_id",
  foreignField: "customer_id",
});

customerSchema.methods.toJSON = function () {
  const customer = this;
  const customerObject = customer.toObject();
  return customerObject;
};
customerSchema.methods.generateAuthToken = async function () {
  const customer = this;
  const token = jwt.sign(
    { _id: customer._id.toString() },
    process.env.JWT_SECRET
  );
  customer.tokens = customer.tokens.concat({ token });
  await customer.save();
  return token;
};
customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Unable to log in!");
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    throw new Error("Incorrect credentials!");
  } else {
    return customer;
  }
};

customerSchema.pre("save", async function (next) {
  const customer = this;
  if (customer.isModified("password")) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

const Customer = mongoose.model("customer", customerSchema);
export default Customer;
