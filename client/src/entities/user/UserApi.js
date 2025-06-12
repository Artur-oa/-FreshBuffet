// import axios from 'axios';
import axiosInstance from '../../shared/lib/axiosInstance';

export default class UserApi {
  static async getAll() {
    const { data } = await axiosInstance.get(`/users`);
    return data;
  }

  static async register(inputs) {
    const { data } = await axiosInstance.post(`/auth/register`, inputs);
    console.log('из апи', data);
    return data;
  }

  static async login(inputs) {
    const { data } = await axiosInstance.post(`/auth/login`, inputs);
    return data;
  }

  static async logout() {
    const { data } = await axiosInstance.get(`/auth/logout`);
    return data;
  }

  static async refresh() {
    const { data } = await axiosInstance.get(`/auth/refresh`);
    return data;
  }

  static async delete(id) {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  }

  static async getOne(id) {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  }

  static async update(id, inputs) {
    const { data } = await axiosInstance.put(`/users/${id}`, inputs);
    return data;
  }

  static async getFavorites() {
  const { data } = await axiosInstance.get('/favorites');
  return data; // массив рецептов
}

  // Добавить рецепт в избранное
  static async addFavorite(recipeId) {
    const { data } = await axiosInstance.post(`/favorites/${recipeId}`);
    return data;
  }

  // Удалить рецепт из избранного
  static async removeFavorite(recipeId) {
    const { data } = await axiosInstance.delete(`/favorites/${recipeId}`);
    return data;
  }
}
