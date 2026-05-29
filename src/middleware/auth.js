const { verifyAccessToken } = require("../utils/tokens");

/**
 * 🔒 Strict Protect — Requires a valid token.
 * Use for: Admin actions, Inventory management, or viewing alternatives.
 */
const protect = (req, res, next) => {
  // Safe case-sensitivity verification for common production routing headers
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    
    // NORMALIZE USER OBJECT: This guarantees req.user contains both .id and ._id 
    // to keep both the mongoose logs and routing rules happy!
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
      _id: decoded._id || decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired. Please refresh.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};

/**
 * 🔓 Optional Protect — Identifies the user if a token exists, but allows guests.
 */
const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); 
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
      _id: decoded._id || decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    next();
  }
};

/**
 * 🛡️ Role Restriction — Validates user role permissions.
 */
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // Easily extract role safely now that req.user is clean and normalized above
    const userRole = req.user?.role;

    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. You do not have permission to access this resource. Required one of: [${allowedRoles.join(", ")}], but your role is: "${userRole || 'None'}"`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo, optionalProtect };