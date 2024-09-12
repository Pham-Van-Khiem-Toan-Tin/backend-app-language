const catchAsyncError = require("../middlewares/function.middleware");
const ErrorHandle = require("../utils/error.util");
const grammarModel = require("../models/grammar.model");
const userModel = require("../models/users.model");

class GrammarController {
  all = catchAsyncError(async (req, res, next) => {
    let grammars = await grammarModel.find({}).select("_id title description");
    res.status(200).json({
      grammars,
    });
  });
  complete = catchAsyncError(async (req, res, next) => {
    let { grammarId, completed } = req.body;
    let user = await userModel.findById(req.user);    
    if (!user) {
      return next(new ErrorHandle("User not found", 500));
    }
    if (user.grammarProgress === null || !Array.isArray(user.grammarProgress)) {
        user.grammarProgress = [];
      }
    const existingProgress = user.grammarProgress.find(
      (progress) => progress.grammarId.toString() === grammarId
    );
    if (!existingProgress) {
      // Nếu chưa có grammarId trong mảng grammarProgress, thêm mới
      user.grammarProgress.push({ grammarId, completed });
    }
    await user.save();
    res.status(200).json({ message: "You have completed the grammar lesson." });
  });
}

module.exports = new GrammarController();
