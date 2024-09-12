const express = require("express");
const grammarController = require("../controllers/grammar.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router
  .route("/all")
  .get(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles("STUDENT"),
    grammarController.all
  );
router
  .route("/complete")
  .put(
    authMiddleware.isAuthenticatedUser,
    authMiddleware.isAuthorizeRoles("STUDENT"),
    grammarController.complete
  );
module.exports = router;
