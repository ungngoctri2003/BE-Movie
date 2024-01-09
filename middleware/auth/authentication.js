const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.header("token");
  try {
    const decoded = jwt.verify(token, "secret");
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(401).send("Bạn cần đăng nhập ");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  authentication,
};
