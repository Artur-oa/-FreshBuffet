const { where } = require("sequelize");
const { User } = require("../../db/models");

class UserService {
  // & получение всех пользователей
  static async getAllUsers() {
    const users = await User.findAll();
    const result = users.map(el => el.get({ plain: true }));
    return result;
  }

  // & получение одного пользователя
  static async getOneUser() {
    const user = await User.findByPk(id);
    const result = user.get({ plain: true });
    return result;
  }

  // & получение пользователя по почте
  static async getByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    } else {
      const result = user.get({ plain: true });
      return result;
    }
  }

  // & создание пользователя
  static async registerUser({ name, email, passwordHash }) {
    const user = await User.create({ name, email, passwordHash });
    const result = user.get({ plain: true });
    return result;
  }

  // & обновление
  static async updateUser(id, data) {
    const user = await User.update(data, { where: { id } });
    if (user) {
      return user;
    } else {
      return false;
    }
  }

  // & удаление
  static async deleteUser(id) {
    const user = await User.findByPk(id);
    user.destroy();
    return id;
  }
}

module.exports = UserService;
