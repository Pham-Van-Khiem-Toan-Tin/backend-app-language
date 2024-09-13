const crypto = require("crypto");

const catchAsyncError = require("../middlewares/function.middleware");
const userModel = require("../models/users.model");
const grammarModel = require("../models/grammar.model");
const vocabularyModel = require("../models/vocabulary.model");
const exerciseModel = require("../models/exercises.model");
const ErrorHandle = require("../utils/error.util");
const emailUtils = require("../utils/email.utils");
class UserController {
  statistical = catchAsyncError(async (req, res, next) => {
    const [vocabularyCount, grammarCount, exerciseCount, user] =
      await Promise.all([
        vocabularyModel.countDocuments(),
        grammarModel.countDocuments(),
        exerciseModel.countDocuments(),
        userModel.findById(req.user),
      ]);
    let wordCount = 0;
    user.vocabularyProgress.forEach((item) => {
      wordCount += item.wordsLearned.length;
    });
    let grammarCompletedCount = user.grammarProgress.length ?? 0;

    let exercisePoint = 0;
    user.exerciseProgress.forEach((item) => {
      exercisePoint += item.score;
    });

    res.status(200).json({
      vocabularyProgress: ((wordCount / vocabularyCount) * 100).toFixed(2),
      grammarProgress: (grammarCompletedCount / grammarCount).toFixed(2) * 100,
      exerciseProgress: (exercisePoint / (exerciseCount * 10)).toFixed(2) * 100,
    });
  });
  register = catchAsyncError(async (req, res, next) => {
    let { name, email, password } = req.body;
    const newUser = await userModel.create({
      name,
      email,
      password,
      role: "STUDENT",
    });
    res.status(200).json({
      success: true,
      message: "Đăng kí người dùng thành công",
      data: newUser,
    });
  });
  login = catchAsyncError(async (req, res, next) => {
    let { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandle("Email và mật khẩu không được để trống", 500)
      );
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandle("Email hoặc mật khẩu không đúng", 500));
    }
    const passwordIsMatch = await user.comparePassword(password);
    if (!passwordIsMatch) {
      return next(new ErrorHandle("Invalid email or password", 500));
    }
    let token = user.generateToken();
    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  });
  forgotPassword = catchAsyncError(async (req, res, next) => {
    let { email } = req.body;
    if (!email) {
      return next(new ErrorHandle("Email không được để trống", 500));
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandle("Người dùng không tồn tại", 500));
    }
    let code = user.getResetPasswordToken();
    await user.save();
    await emailUtils.sendForgotPasswordCode(email, code);
    user.resetCode = code;
    res.status(200).json({
      message:
        "Yêu cầu đặt lại mật khẩu thành công. Vui lòng nhập mã xác nhận để đổi mật khẩu.",
    });
  });
  verifyResetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return next(new ErrorHandle("Mã xác nhận không hợp lệ", 500));
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(200)
      .json({ message: "Mã xác nhận chính xác. Vui lòng nhập mật khẩu mới" });
  });
  changePassword = catchAsyncError(async (req, res, next) => {
    const {email, newPass} = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
      return next(new ErrorHandle("Người dùng không tồn tại", 500));
    }
    user.password = newPass;
    await user.save();
    res.status(200).json({message: "Đổi mật khẩu thành công"});
  })
}

module.exports = new UserController();
