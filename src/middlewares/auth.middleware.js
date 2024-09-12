const ErrorHandle = require("../utils/error.util");
const jwt = require("jsonwebtoken");

class AuthMiddleware {
  isAuthenticatedUser = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new ErrorHandle("Please login to access the resource"));
    }
    try {
      const decodeData = await jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decodeData.id;
      req.role = decodeData.role;
      req.name = decodeData.name;
      next();
    } catch (error) {
        return next(new ErrorHandle("login expired!", 501));
    }
  };
  isAuthorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
          return next(
            new ErrorHandle(`Role: You is not allowed to access this resource`, 403)
          );
        }
        next();
      };
  }
}

module.exports = new AuthMiddleware();
