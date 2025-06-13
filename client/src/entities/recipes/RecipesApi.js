import axios from 'axios';

axios.defaults.withCredentials = true;

const { VITE_TARGET, VITE_API } = import.meta.env;

class RecipesApi {
  static async getAll() {
    const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes`);

    return response.data;
  }

  static async getRandomRecipes() {
    const response = await axios.get(
      `${VITE_TARGET}${VITE_API}/recipes/random`
    );

    return response.data;
  }

  static async getById(id) {
    const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes/${id}`);
    return response.data;
  }

  static async getPaginated(page = 1, limit = 9) {
    const response = await axios.get(
      `${VITE_TARGET}${VITE_API}/recipes?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  static async loadFromApi() {
    const response = await axios.post(`${VITE_TARGET}${VITE_API}/recipes/load`);
    return response.data;
  }

  // Получить количество человек, лайкнувших рецепт
  static async getFavoritesCount(recipeId) {
    const { data } = await axios.get(
      `/recipes/${recipeId}/favoritesCount`
    );
    return data;
  }

}
export default RecipesApi;
