const mongoose = require("mongoose");
require("dotenv").config();

const exerciseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: {
                    type: Array,
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
const exerciseModel = mongoose.model("exercises", exerciseSchema);
module.exports = exerciseModel;