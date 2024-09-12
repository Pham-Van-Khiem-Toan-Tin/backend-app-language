const express = require("express");
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router
  .route("/statistical")
  .get(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles("STUDENT"),
    UserController.statistical
  );
module.exports = router;
