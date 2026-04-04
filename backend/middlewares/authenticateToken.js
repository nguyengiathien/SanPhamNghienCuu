const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Yeu cau token xac thuc" });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: "JWT_SECRET chua duoc cau hinh" });
    }

    jwt.verify(token, secretKey, async (err, data) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: "Token da het han" });
        }
        return res.status(403).json({ message: "Token khong hop le" });
      }

      // bạn đang dùng payload key là userId
      const userId = data.userId;
      if (!userId) {
        return res.status(403).json({ message: "Token khong hop le, thieu userId" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(401).json({ message: "Xac thuc that bai" });
      }

      req.user = user; // req.user = instance Sequelize User
      next();
    });
  } catch (e) {
    next(e);
  }
};

module.exports = authenticateToken;
