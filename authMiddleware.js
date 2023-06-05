const User = require('./userSchema');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await User.findOne({ token });
    if (user) {
      req.user = user;
      next();
    } else {
      res.send({ error: 'Invalid token' });
    }
  } catch (error) {
    res.send({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
