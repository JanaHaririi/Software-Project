const jwt = require('jsonwebtoken');

// Authentication middleware function
function authMiddleware(req, res, next) {
  // Extract token from cookies or Authorization header
  let token = req.cookies.token || req.header('Authorization');
  
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  // If no token found
  if (!token) {
    console.log(`[${new Date().toISOString()}] No token provided in request`);
    return res.status(401).json({ message: 'Not authenticated. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[${new Date().toISOString()}] Token decoded:`, decoded);

    // Attach user info to request
    req.user = { id: decoded.id, role: decoded.role };

    next(); // Proceed to next middleware/route
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Invalid or expired token:`, err.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;