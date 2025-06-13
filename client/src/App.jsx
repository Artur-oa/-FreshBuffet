import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AuthPage from './features/auth/ui/AuthPage/AuthPage';
import Root from './app/Root';
import MainPage from './pages/MainPage/MainPage';

import UserApi from "./entities/user/UserApi";
import { UserValidator } from "./entities/user/User.validator";
import { setAccessToken } from "./shared/lib/axiosInstance";
import ProtectedRoute from "./utils/ProtectedRoute/ProtectedRoute";

import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await UserApi.refresh();
        if (data.statusCode === 200 && data.data.accessToken) {
          setUser(pre => ({ ...pre, ...data.data.user }));
          setAccessToken(data.data.accessToken);
          console.log(data.data.accessToken);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const getfavorites = async () => {
    const response = await UserApi.getFavorites(user?.id);
    if (response.data?.length) {
      user.favorites = response.data?.map(el => el?.id);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getfavorites();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root user={user} setUser={setUser} />}>
          {/* Базовый маршрут редирект на /recipes */}
          <Route path='/' element={<Navigate to='/recipes' />} />

          {/* Регистрация */}
          <Route
            path='/auth'
            element={<AuthPage isAuthProp='auth' setUser={setUser} />}
          ></Route>

          {/* Избранное с защитой для незарегистрированных пользователей */}
          <Route
            path='/favorites'
            element={
              <ProtectedRoute isAuthenticated={user} redirectTo='/recipes'>
                <FavoritesPage user={user} setUser={setUser}/>
              </ProtectedRoute>
            }
          />

          {/* Рецепты */}
          <Route
            path='/recipes'
            element={<MainPage user={user} setUser={setUser} />}
          />

          {/* Детальная информация рецепта */}
          <Route
            path='/recipes/:id'
            element={<RecipeDetailsPage user={user} />}
          />
          {/* <Route
            path="/auth"
            element={
              <ProtectedRoute
                isAuthenticated={user ? true : false}
                redirectTo="/recipes"
              >
                <AuthPage isAuthProp="login" setUser={setUser} />
              </ProtectedRoute>
            }
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
