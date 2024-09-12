const catchAsyncError = require("../middlewares/function.middleware");
const userModel = require("../models/users.model");
const grammarModel = require("../models/grammar.model");
const vocabularyModel = require("../models/vocabulary.model");
const exerciseModel = require("../models/exercises.model");

const ErrorHandle = require("../utils/error.util");
class UserController {
  statistical = catchAsyncError(async (req, res, next) => {
      const [vocabularyCount, grammarCount, exerciseCount, user] = await Promise.all([
        vocabularyModel.countDocuments(),
        grammarModel.countDocuments(),
        exerciseModel.countDocuments(),
        userModel.findById(req.user)
      ]);
      let wordCount = 0;
      user.vocabularyProgress.forEach((item) => {
          wordCount += item.wordsLearned.length;
      })
      let grammarCompletedCount= user.grammarProgress.length ?? 0;
      console.log(grammarCompletedCount);
      console.log(grammarCount);
      
      let exercisePoint = 0;
      user.exerciseProgress.forEach((item) => {
        exercisePoint += item.score;
      })
      
      res.status(200).json({
        vocabularyProgress: (wordCount/vocabularyCount).toFixed(2)*100,
        grammarProgress: (grammarCompletedCount / grammarCount).toFixed(2)*100,
        exerciseProgress: (exercisePoint / (exerciseCount * 10)).toFixed(2)*100
      })
  })
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
        message: 'User registered successfully',
        data: newUser,
      });
    });
    login = catchAsyncError(async (req, res, next) => {
      let {email, password} = req.body;
      if (!email || !password) {
        return next(new ErrorHandle("Please Enter Email and Password", 500));
      }
      const user = await userModel.findOne({email}).select("+password");
      if (!user) {
        return next(new ErrorHandle("Invalid email or password", 500));
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
        token: token
      });
    })
}

module.exports = new UserController();
