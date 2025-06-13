const express = require('express');
const serverConfig = require('./src/configs/serverConfig');
require('dotenv').config();


const app = express();
// Конфигурируем сервер
serverConfig(app);

app.get('/', (req, res) => {
  res.send('🔥 Базовый сервер работает!');
});

module.exports = app;