const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Access denied, token missing' });
  }

  jwt.verify(token, '32131241231231223', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // Store the decoded user info in the request object
    next();
  });
}

module.exports = { authenticateJWT };
