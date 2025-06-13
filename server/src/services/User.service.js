
const { User } = require("../../db/models");

class UserService {
  // & получение всех пользователей
  static async getAllUsers() {
    const users = await User.findAll();
    const result = users.map(el => el.get({ plain: true }));
    return result;
  }

  // & получение одного пользователя
  static async getOneUser(id) {
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
    // Массив дефолтных аватарок (пути относительно public или uploads/avatars)
    const defaultAvatars = [
      '/public/default1.png',
      '/public/default2.svg',
      '/public/default3.svg'
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const user = await User.create({ name, email, passwordHash, avatarUrl: randomAvatar });
    return user.get({ plain: true });
  }

  // & обновление
  // static async updateUser(id, data) {
  //   const user = await User.update(data, { where: { id } });
  //   if (user) {
  //     return user;
  //   } else {
  //     return false;
  //   }
  // }

  static async updateUser(id, data) {
    await User.update(data, { where: { id } });
    // Вернём свежего пользователя:
    const user = await User.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  }

  // & удаление
  static async deleteUser(id) {
    const user = await User.findByPk(id);
    user.destroy();
    return id;
  }


}

module.exports = UserService;
