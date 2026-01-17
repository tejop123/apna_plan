const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function authorize(roles = []) {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }

    return next();
  };
}

// Middleware for user authentication
const requireAuth = authenticate;

// Middleware for admin authorization
const requireAdmin = authorize('admin');

module.exports = { authenticate, authorize, requireAuth, requireAdmin };
