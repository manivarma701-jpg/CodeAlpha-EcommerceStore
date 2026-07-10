const jwt = require('jsonwebtoken');

// Verifies the Authorization: Bearer <token> header and attaches req.user
function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
}

// Use after protect() to restrict a route to admin accounts
function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { protect, adminOnly };
