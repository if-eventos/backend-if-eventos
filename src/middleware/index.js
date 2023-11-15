const jwt = require('jsonwebtoken');


const initLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};


const isAPIAuthenticated = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization) {
    try {
      const [, token] = authorization.split(' ');
      await jwt.verify(token, process.env.SECRET);
      const { userId } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      res.locals.ApiUserId = userId;

      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  } else {
    res.status(401).json({ error: 'Authorization header is empty.' });
  }
};


module.exports = { initLocals, isAPIAuthenticated };