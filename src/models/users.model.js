const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");
require("dotenv").config();
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 character"],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["TEACHER", "STUDENT"],
    },
    vocabularyProgress: [
      {
        topicId: {
          type: String,
          ref: "topics",
          required: true,
        },
        wordsLearned: [
          {
            wordId: {
              type: ObjectId,
              ref: "vocabulary",
              required: true,
            },
            learned: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    grammarProgress: [
      {
        grammarId: {
          type: ObjectId,
          ref: "grammar",
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    exerciseProgress: [
      {
        exerciseId: {
          type: ObjectId,
          ref: "exercises",
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      name: this.name,
      email: this.email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );
};
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
