const express = require("express");
const translateController = require("../controllers/translate.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router
  .route("/translate")
  .post(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles("STUDENT"),
    translateController.translate
  );
  router.route("/mp3/:filename").get(
    translateController.speak
  )
module.exports = router;
