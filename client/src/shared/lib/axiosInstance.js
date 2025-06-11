import axios from 'axios';

const { VITE_TARGET, VITE_API } = import.meta.env;


export const axiosInstance = axios.create({
  baseURL:`${VITE_TARGET}${VITE_API}`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// * переменная для хранения кратковременного токена
let accessToken = '';

// * используй эту ф-ию там, где ты ожидаешь приход токенов
export function setAccessToken(token) {
  accessToken = token;
}

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.authorization) {
    config.headers.authorization = `Bearer, ${accessToken}`;
  }
  return config;
});

// * Перехватчик ответов:
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ? Запомнили ин-фю о прошлом запросе
    const prevRequest = error.config;
    // ? Проверяем статус
    // ? проверка на первичность запроса, если попали внутрь
    // ? значит токен протух и нужна новая пара
    if (error.response.status === 403 && !prevRequest.sent) {
      // ? Делаем запрос на пару токенов
      const response = await axiosInstance.get('/refresh');
      // ? Достаём токен из ответа
      setAccessToken(response.data.accessToken);
      // ? создаём новый ключ и sent для проверки первичности
      prevRequest.sent = true;
      // ? Установим заголовки
      prevRequest.headers.authorization = `Bearer, ${accessToken}`;
      // ? Делаем повторный запрос
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;