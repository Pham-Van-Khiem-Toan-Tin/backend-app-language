const catchAsyncError = require("../middlewares/function.middleware");
const { translate, speak } = require("google-translate-api-x");
const ErrorHandle = require("../utils/error.util");
const { writeFileSync, existsSync } = require("fs");
const path = require("path");
class TranslateController {
  translate = catchAsyncError(async (req, res, next) => {
    let { text, from, to } = req.body;
    if (!text) {
      return next(new ErrorHandle("Please enter text", 500));
    }
    const sanitizedText = text.replace(/[^a-zA-Z0-9]/g, "_"); // Tạo tên file từ văn bản
    const translatedText = await translate(text, {
      from: from,
      to: to,
    });
    const mp3FileName = `${sanitizedText}_de.mp3`; // Tên file: văn bản_gốc_ngôn_ngữ_đích
    const mp3Dir = __dirname + "/../mp3";
    const mp3FilePath = path.join(mp3Dir, mp3FileName);
    try {
      if (!existsSync(mp3FileName)) {
          let mp3 = await speak(text, {
            to: to,
          });
          writeFileSync(mp3FilePath, mp3, { encoding: "base64" });
      }
      return res.json({
        text: text,
        translatedText: translatedText.text,
        mp3Url: `api/mp3/${mp3FileName}`,
      });
    } catch (error) {
        console.log(error);
    }
   
  });
  speak = (req, res, next) => {
    const filename = req.params.filename;
    
    const filePath = path.join(__dirname + "/../", 'mp3', filename);
    res.sendFile(filePath);
  }
}

module.exports = new TranslateController();
