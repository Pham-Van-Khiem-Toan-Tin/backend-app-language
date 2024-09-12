const mongoose = require("mongoose");
require("dotenv").config();

const grammarSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const grammarModel = mongoose.model("grammar", grammarSchema);
module.exports = grammarModel;
