const jwt = require('jsonwebtoken');

// Authentication middleware function
function authMiddleware(req, res, next) {
  // Extract token from cookies or Authorization header
  const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

  // If no token found
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { id: decoded.id, role: decoded.role };

    next(); // Proceed to next middleware/route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
