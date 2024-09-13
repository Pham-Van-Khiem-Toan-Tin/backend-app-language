const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const exerciseController = require("../controllers/exercise.controlkler");

const router = express.Router();

router.route("/all").get(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles(["STUDENT"]),
    exerciseController.all
)
router.route("/complete").put(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles(["STUDENT"]),
    exerciseController.complete
)
module.exports = router;