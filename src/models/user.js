import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const userSchema = mongoose.Schema(
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
    // avatar: {
    //   type: Buffer,
    // },
    role: {
      type: String,
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

userSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "user_id",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error("Unable to log in!");
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new Error("Incorrect credentials!");
//   } else {
//     return user;
//   }
// };

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("user", userSchema);
export default User;
