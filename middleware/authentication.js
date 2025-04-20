const jwt = require('jsonwebtoken'); // Import the JSON Web Token library for authentication

// Define the authentication middleware function
function authMiddleware(req, res, next) {
  // Extract the token from cookies or the Authorization header
  const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

  // If no token is provided, respond with an unauthorized status
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the decoded user information to the request object
    req.user = { id: decoded.id, role: decoded.role };
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid or has expired, respond with an unauthorized status
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Export the authentication middleware to be used in routes
module.exports = authMiddleware; // Default export