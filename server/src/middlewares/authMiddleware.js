const jwt = require('jsonwebtoken');
const { User } = require('../../db/models'); // путь до модели User может отличаться

 async function authMiddleware(req, res, next) {
  try {
    let token;
    // Можно взять из заголовка или из cookies (зависит от реализации)
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Нет токена, доступ запрещен" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Можно добавить к запросу пользователя
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = user; // теперь в req.user будет вся информация пользователя
    next();
  } catch (err) {
    res.status(401).json({ message: "Ошибка авторизации", error: err.message });
  }
};

module.exports = authMiddleware