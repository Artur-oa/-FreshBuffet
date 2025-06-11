const UserValidator = require("../utils/userValidator");
const formatResponse = require("../utils/formatResponse");
const generateTokens = require("../utils/generateTokens");
const UserService = require("../services/User.service");
const cookieConfig = require("../configs/cookieConfig");
const bcrypt = require("bcrypt");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, passwordHash } = req.body;
      const { isValid, error } = UserValidator.validate({
        name,
        email,
        passwordHash,
      });

      if (!isValid) {
        res.status(400).json(
          formatResponse({
            statusCode: 400,
            message: "Валидация не прошла",
            error: error.message,
          }),
        );
      } else {
        const hashedPassword = await bcrypt.hash(passwordHash, 10);
        const normalizedEmail = email.toLowerCase();
        const userFound = await UserService.getByEmail(normalizedEmail);

        if (userFound) {
          res.status(400).json(
            formatResponse({
              statusCode: 400,
              message: `Пользователь с почтой ${email} уже зарегистрирован`,
              error: `Пользователь с почтой ${email} уже зарегистрирован`,
            }),
          );
        } else {
          const user = await UserService.registerUser({
            name,
            email: normalizedEmail,
            passwordHash: hashedPassword,
          });
          delete user.passwordHash;
          const { accessToken, refreshToken } = generateTokens({ user });

          res
            .status(200)
            .cookie("refreshTokenBuffet", refreshToken, cookieConfig.refresh)
            .json(
              formatResponse({
                statusCode: 200,
                message: "Пользователь успешно зарегистрирован",
                data: { accessToken, user },
              }),
            );
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось создать пользователя",
          error: error.message,
        }),
      );
    }
  }

  static async login(req, res) {
    try {
      const { email, passwordHash } = req.body;
      const normalizedEmail = email.toLowerCase();

      const user = await UserService.getByEmail(normalizedEmail);

      if (!user) {
        res.status(400).json(
          formatResponse({
            statusCode: 400,
            message: `Пользователь с почтой ${email} не найден`,
            error: `Пользователь с почтой ${email} не найден`,
          }),
        );
      } else {
        // * Сравнение паролей
        const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);

        if (!isPasswordValid) {
          res.status(400).json(
            formatResponse({
              statusCode: 400,
              message: "Неверный пароль",
              error: "Неверный пароль",
            }),
          );
        } else {
          delete user.passwordHash;

          const { accessToken, refreshToken } = generateTokens({ user });

          res
            .status(200)
            .cookie("refreshTokenBuffet", refreshToken, cookieConfig.refresh)
            .json(
              formatResponse({
                statusCode: 200,
                message: "Пользователь успешно авторизован",
                data: { accessToken, user },
              }),
            );
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось войти",
          error: error.message,
        }),
      );
    }
  }

  static async logout(req, res) {
    try {
      res
        .status(200)
        .clearCookie("refreshTokenBuffet")
        .json(
          formatResponse({
            statusCode: 200,
            message: "Успешный выход",
          }),
        );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось выйти",
          error: error.message,
        }),
      );
    }
  }

  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .status(200)
        .cookie("refreshTokenBuffet", refreshToken, cookieConfig.refresh)
        .json(
          formatResponse({
            statusCode: 200,
            message: "Перевыпуск токенов успешен!",
            data: { accessToken, user },
          }),
        );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось перевыпустить токены",
          error: error.message,
        }),
      );
    }
  }
}

module.exports = AuthController
