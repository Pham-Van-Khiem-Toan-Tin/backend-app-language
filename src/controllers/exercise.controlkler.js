const catchAsyncError = require("../middlewares/function.middleware");
const ErrorHandle = require("../utils/error.util");
const exerciseModel = require("../models/exercises.model");
const userModel = require("../models/users.model");

class Exercise {
  all = catchAsyncError(async (req, res, next) => {
    let exercises = await exerciseModel
      .find({})
      .select("_id description title questions");
    res.status(200).json({ exercises });
  });
  complete = catchAsyncError(async (req, res, next) => {
    let { exerciseId, completed, score } = req.body;
    let user = await userModel.findById(req.user);
    if (!user) {
      return next(new ErrorHandle("Không tìm thấy người dùng", 500));
    }
    if (
      user.exerciseProgress === null ||
      !Array.isArray(user.exerciseProgress)
    ) {
      user.exerciseProgress = [];
    }
    const existingProgressIndex = user.exerciseProgress.findIndex(
      (progress) => progress.exerciseId.toString() === exerciseId
    );
    if (existingProgressIndex == -1) {
      user.exerciseProgress.push({ exerciseId, completed, score });
    } else {
      user.exerciseProgress[existingProgressIndex].completed = completed;
      user.exerciseProgress[existingProgressIndex].score = score;
    }
    await user.save();

    res.status(200).json({
      message: "Cập nhật bài tập thành công",
    });
  });
}

module.exports = new Exercise();
