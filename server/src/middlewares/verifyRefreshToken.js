const jwt = require("jsonwebtoken");

const formatResponse = require("../utils/formatResponse");

const { REFRESH_TOKEN } = process.env;

const verifyRefreshToken = (req, res, next) => {
  try {
    const { refreshTokenBuffet } = req.cookies; // * по ключу достаём токен из куки

    const { user } = jwt.verify(refreshTokenBuffet, REFRESH_TOKEN);

    // * обновление пользователя через res.locals
    res.locals.user = user;
    next();
  } catch (error) {
    console.log("Invalid refresh token", error);
    res
      .status(401)
      .clearCookie("refreshTokenBuffet")
      .json(
        formatResponse({
          statusCode: 401,
          message: "Неверный рефреш токен",
          error: error.message,
        }),
      );
  }
};

module.exports = verifyRefreshToken;
