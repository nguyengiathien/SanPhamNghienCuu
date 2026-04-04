const authorizeRole = (...allowedRoles) => {
  const roles = allowedRoles.flat(); // hỗ trợ truyền mảng hoặc nhiều tham số

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Khong the xac dinh vai tro nguoi dung de phan quyen",
      });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Ban khong duoc quyen truy cap tai nguyen" });
    }

    next();
  };
};

module.exports = authorizeRole;
