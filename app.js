const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRouter = require("./src/routers/user.router");
const translateRouter = require("./src/routers/translate.router");
const grammarRouter = require("./src/routers/grammar.router");
const vocabularyRouter = require("./src/routers/vocabulary.router");
const exerciseRouter = require("./src/routers/exercise.router");



const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/api", userRouter);
app.use("/api", translateRouter);
app.use("/api/grammar", grammarRouter);
app.use("/api/vocabulary", vocabularyRouter);
app.use("/api/exercise", exerciseRouter); 

module.exports = app;
