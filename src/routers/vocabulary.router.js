const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const vocabularyController = require("../controllers/vocabulary.controller");
const router = express.Router();

router.route("/all").get(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles(["STUDENT"]),
    vocabularyController.all
)
router.route("/topic/:id").get(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles(["STUDENT"]),
    vocabularyController.allWordOfTopic
)
router.route("/topic/complete").put(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles(["STUDENT"]),
    vocabularyController.complete
)
module.exports = router;