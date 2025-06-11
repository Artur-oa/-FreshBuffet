const express = require('express');
const serverConfig = require('./src/configs/serverConfig');

const app = express();
// Конфигурируем сервер
serverConfig(app);

// Тестовый маршрут
app.get('/', (req, res) => {
  res.send('🔥 Базовый сервер работает!');
});

module.exports = app;