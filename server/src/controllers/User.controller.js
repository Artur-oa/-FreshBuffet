const UserService = require("../services/User.service");
const formatResponse = require("../utils/formatResponse");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Неподдерживаемый тип файла. Разрешены только изображения."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

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
      console.log(req.params);
      
      const user = await UserService.getOneUser(id);
      console.log(2);
      
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

  static async uploadAvatar(req, res) {
  try {
    const uploadMiddleware = upload.single("avatar");
    uploadMiddleware(req, res, async err => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Предполагаем, что userId узнаешь из токена/auth-middleware
      const userId = req.user.id;
      // Сохраняем ссылку на файл-аватар в базе
      const filePath = '/public/' + req.file.filename;
      await User.update({ avatarUrl: filePath }, { where: { id: userId } });
      res.json({ avatarUrl: filePath });
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при загрузке аватара', details: error.message });
  }
}

static async getProfile(req, res) {
  try {
    const user = req.user; // authMiddleware должен добавлять req.user
    console.log('++++++++++++', user);
    
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при загрузке профиля', details: error.message });
  }
}
}

module.exports = UserController;
