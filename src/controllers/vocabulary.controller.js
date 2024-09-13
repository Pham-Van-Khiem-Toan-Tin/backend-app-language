const catchAsyncError = require("../middlewares/function.middleware");
const ErrorHandle = require("../utils/error.util");
const vocabularyModel = require("../models/vocabulary.model");
const topicModel = require("../models/topics.model");
const userModel = require("../models/users.model");

class Vocabulary {
  all = catchAsyncError(async (req, res, next) => {
    let topics = await topicModel.find({}).select("_id name description");
    res.status(200).json({ topics });
  });
  allWordOfTopic = catchAsyncError(async (req, res, next) => {
    try {
        let { id } = req.params;
        
        let words = await vocabularyModel.find({ topic: id });
        res.status(200).json({ words });
        
    } catch (error) {
        console.log(error);
        
    }
  });
  complete = catchAsyncError(async (req, res, next) => {
    
    let {topicId, wordId, learned} = req.body;
    let user = await userModel.findById(req.user);
    if (!user) {
      return next(new ErrorHandle("Không tìm thấy người dùng", 500));
    }
    if (user.vocabularyProgress === null || !Array.isArray(user.vocabularyProgress)) {
      user.vocabularyProgress = [];
    }
    const existingTopic = user.vocabularyProgress.find(
      (progress) => progress.topicId.toString() === topicId
    );
    if (!existingTopic) {
      user.vocabularyProgress.push({topicId: topicId, wordsLearned: [{wordId, learned}]});
    } else {
      let topic = user.vocabularyProgress.filter((item) => item.topicId.toString() === topicId);
      const existingWord = topic.wordsLearned.find((item) => item.wordId.toString() === wordId);
      if (!existingWord) {
        topic.wordsLearned.push({wordId, learned});
      }
    }
    await user.save();
    res.status(200).json({ message: `Bạn đã học thành công từ mới` });
  });
}

module.exports = new Vocabulary();
