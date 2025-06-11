const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const removeXPoweredBy = require('../middlewares/removeHeader')


const indexRouter = require("../routes/index.router");

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  optionsSuccessStatus: 200,
  credentials: true // Передаём куки на клиент 
}

function serverConfig(app) {
  // Подключаем CORS
  app.use(cors(corsOptions))

  // Middleware (базовые)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  // Чтение куки-файлов
  app.use(cookieParser());

  // Подключение самописной мидлварки для скрытия заголовка
  // X-Powered-By: Express
  app.use(removeXPoweredBy)

  // Роуты
  app.use("/api", indexRouter);
}

module.exports = serverConfig;