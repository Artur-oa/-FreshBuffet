import axios from 'axios';

axios.defaults.withCredentials = true;

const { VITE_TARGET, VITE_API } = import.meta.env;

class UserApi {
  static async signUp(userData) {
    const response = await axios.post(
      `${VITE_TARGET}${VITE_API}/auth/signUp`,
      userData
    );
    console.log(" response:", response.data);
    return response.data;
  }

  static async signIn(userData) {
    const response = await axios.post(
      `${VITE_TARGET}${VITE_API}/auth/signIn`,
      userData
    );
    return response.data;
  }

  static async signOut() {
    const response = await axios.get(`${VITE_TARGET}${VITE_API}/auth/signOut`);
    return response.data;
  }
}

export default UserApi;
