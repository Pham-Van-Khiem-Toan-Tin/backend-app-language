const mongoose = require("mongoose");
require("dotenv").config();
const ObjectId = mongoose.Schema.Types.ObjectId;

const vocabularySchema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            ref: "topics",
            required: true
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: {
                    type: [String],
                    required: true
                },
                correct_answer: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {timestamps: true}
)
const vocabularyModel = mongoose.model("vocabulary", vocabularySchema);
module.exports = vocabularyModel;