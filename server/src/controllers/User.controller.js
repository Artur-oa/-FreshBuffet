const UserService = require("../services/User.service");
const formatResponse = require("../utils/formatResponse");

class UserController {
  // & контроллер на получение всех пользователей
  static async getAll(req, res) {
    try {
      const result = await UserService.getAllUsers();
      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Все пользователи получены",
          data: result,
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Нет доступа",
          error: error.message,
        }),
      );
    }
  }

  // & контроллер на получение одного пользователя
  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getOneUser(id);
      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Один пользователь получен",
          data: user,
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Нет доступа",
          error: error.message,
        }),
      );
    }
  }

  // & контроллер на обновление
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, passwordHash } = req.body;
      const updatedUser = await UserService.updateUser(id, { name, email, passwordHash });
      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Пользователь успешно обновлён",
          data: updatedUser,
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось обновить пользователя",
          error: error.message,
        }),
      );
    }
  }

  // & контроллер на удаление
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Пользователь успешно удалён",
          data: result,
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Не удалось удалить пользователя",
          error: error.message,
        }),
      );
    }
  }
}

module.exports = UserController;

