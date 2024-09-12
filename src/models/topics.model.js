const mongoose = require("mongoose");
require("dotenv").config();

const topicSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }
)

const topicModel = mongoose.model("topics", topicSchema);
module.exports = topicModel;