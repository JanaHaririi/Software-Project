// middleware/authorization.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  console.log(`[${new Date().toISOString()}] Authenticating request for ${req.originalUrl}`);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Invalid token:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Authorizing roles for ${req.originalUrl}, user role: ${req.user.role}`);
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied. User role ${req.user.role} not in allowed roles: ${roles}`);
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };