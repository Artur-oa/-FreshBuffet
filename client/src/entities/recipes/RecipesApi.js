import axios from 'axios';

axios.defaults.withCredentials = true;

const { VITE_TARGET, VITE_API } = import.meta.env;

class RecipesApi {
  static async getAll() {
    const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes`);

    return response.data;
  }

  static async getById(id) {
  const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes/${id}`);
  return response.data;
}

}

export default RecipesApi;

// ИЛИ
/* import axios from 'axios';

const { VITE_TARGET, VITE_API } = import.meta.env;

class RecipesApi {
  static async getAll() {
    const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes`, {
      withCredentials: true,
    });

    return response.data;
  }

  static async getById(id) {
  const response = await axios.get(`${VITE_TARGET}${VITE_API}/recipes/${id}`);
  return response.data;
}

}

export default RecipesApi; */
