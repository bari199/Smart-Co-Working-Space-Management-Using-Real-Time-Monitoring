const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("ROLE MIDDLEWARE ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

export default roleMiddleware;
