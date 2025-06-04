// axiosInstance.js
import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Добавляем access токен в каждый запрос
myAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка 401 ошибок и попытка обновить токен
myAxios.interceptors.response.use(
  (response) => response, // если всё ок — возвращаем ответ
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и запрос ещё не повторяли
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        
        

        const res = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        // Применяем новый access токен и повторяем запрос
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return myAxios(originalRequest);
      } catch (err) {
        // Не удалось обновить — редирект на логин
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location = "/login";
      }
    }

    // Если ошибка не 401 или уже повторяли — пробрасываем
    return Promise.reject(error);
  }
);

export default myAxios;
