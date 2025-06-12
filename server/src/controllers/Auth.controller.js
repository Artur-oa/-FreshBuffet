const UserService = require("../services/User.service");
const AuthValidator = require("../utils/Auth.validator");
const formatResponse = require("../utils/formatResponse");
const bcrypt = require("bcrypt");
const cookiesConfig = require("../configs/cookieConfig");
const generateTokens = require("../utils/generateTokens");

class AuthController {
  // Регистрация нового пользователя
  static async signUp(req, res) {
    const { email, username, password } = req.body;

    // Шаг 1. Валидация входных данных
    const { isValid, error } = AuthValidator.validateSignUp({
      email,
      username,
      password,
    });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, "Validation error", null, error));
    }

    const normalizedEmail = email.toLowerCase(); // Приведение email к нижнему регистру

    try {
      // Шаг 2. Проверка, существует ли уже пользователь с таким email
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (userFound) {
        return res
          .status(400)
          .json(formatResponse(400, "User already exists", null, "User already exists"));
      }

      // Шаг 3. Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 10); // 10 — уровень "соли"

      // Шаг 4. Создание нового пользователя в базе
      const newUser = await UserService.create({
        username,
        email: normalizedEmail,
        passwordHash: hashedPassword,
      });

      if (!newUser) {
        return res
          .status(400)
          .json(formatResponse(400, "Failed to register user", null, "Failed to register user"));
      }

      // Шаг 5. Убираем чувствительные данные (например, пароль)
      const plainUser = newUser.get({ plain: true });
      delete plainUser.passwordHash;

      // Шаг 5. Генерация токенов
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      // Шаг 6.Отправка токенов клиенту
      res
        .status(201)
        .cookie("refreshToken", refreshToken, cookiesConfig)
        .json(
          formatResponse(201, "Register successful", {
            user: plainUser,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Internal server error", null, message));
    }
  }

  // Вход зарегистрированного пользователя
  static async signIn(req, res) {
    const { email, password } = req.body;

    // Шаг 1. Валидация данных
    const { isValid, error } = AuthValidator.validateSignIn({ email, password });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, "Validation error", null, error));
    }

    const normalizedEmail = email.toLowerCase();

    try {
      // Шаг 2. Поиск пользователя в базе
      const user = await UserService.getByEmail(normalizedEmail);

      if (!user) {
        return res.status(400).json(formatResponse(400, "User not found", null, "User not found"));
      }

      // Шаг 3. Сравнение введённого пароля с хэшем
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(formatResponse(400, "Invalid password", null, "Invalid password"));
      }

      // Шаг 4. Очистка лишних данных
      const plainUser = user.get({ plain: true });
      delete plainUser.passwordHash;

      // Шаг 5. Генерация токенов
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      // Шаг 6.Отправка токенов клиенту
      res
        .status(200)
        .cookie("refreshToken", refreshToken, cookiesConfig)
        .json(
          formatResponse(200, "Login successful", {
            user: plainUser,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Internal server error", null, message));
    }
  }

  // Выход пользователя из системы
  static async signOut(req, res) {
    try {
      res.clearCookie("refreshToken").json(formatResponse(200, "Logout successfully"));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Internal server error", null, message));
    }
  }
}

module.exports = AuthController;
