const jwt = require("jsonwebtoken");
module.exports = {
  isAuth: async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      //removes bearer and leaves only token part
      const token = authorization.slice(7, authorization.length);
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid token" });
        } else {
          req.user = decode;
          next();
        }
      });
    } else {
      res.status(401).send({ message: "No Token" });
    }
  },
};
