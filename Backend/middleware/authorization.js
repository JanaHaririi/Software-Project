const jwt = require('jsonwebtoken'); // Import the JSON Web Token library for token verification

// Function to authenticate a user by verifying the JWT token
function authenticate(req, res, next) {
  const token = req.cookies.token || req.header('Authorization')?.split(' ')[1]; // Extract token from cookies or Authorization header

  if (!token) { // If no token is provided, return an unauthorized error
    return res.status(401).json({ message: 'Not authenticated. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the JWT_SECRET
    req.user = { id: decoded.id, role: decoded.role }; // Add user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) { // If token verification fails, return an unauthorized error
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Function to authorize roles by checking if the user's role is in the list of allowed roles
function authorizeRoles(...allowedRoles) { // Use rest parameters to accept multiple allowed roles
  return (req, res, next) => { // Return a new function to be used as middleware
    if (!req.user) { // If no user is found in the request, return an unauthorized error
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) { // If user's role is not in the list of allowed roles
      return res.status(403).json({ message: 'Forbidden: Access denied.' }); // Return a forbidden error
    }

    next(); // If authorized, proceed to the next middleware or route handler
  };
}

module.exports = { authenticate, authorizeRoles }; // Export both functions to be used in routes