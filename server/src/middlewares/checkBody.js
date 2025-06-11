const { User } = require("../../db/models");

function checkBody(req, res, next) {
  const { name, email, passwordHash } = req.body;
  if (!email || !passwordHash) {
    res.send("Все поля должны быть заполнены. Ответ из мидлварки");
  } else {
    next();
  }
}

async function checkId(req, res, next) {
  const { id } = req.params;
  if (Number(id)) {
    const user = await User.findByPk(id);
    if (user) {
      next();
    } else {
      res.status(400).send("Пользователь не найден");
    }
  } else {
    res.status(400).send("Невалидный id. Должен быть числом");
  }
}

module.exports = { checkId, checkBody };
