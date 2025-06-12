import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import AuthPage from './features/auth/ui/AuthPage/AuthPage';
import Root from './app/Root';
import MainPage from './pages/MainPage';

import UserApi from './entities/user/UserApi';
import { UserValidator } from './entities/user/User.validator';
import { setAccessToken } from './shared/lib/axiosInstance';
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute';

import RecipeDetailsPage from './pages/RecipeDetailsPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  const [user, setUser] = useState(null);
  console.log('--------------.>>>>>>>>>>>>', user);
  
  // const [users, setUsers] = useState([]);

  // const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await UserApi.refresh();
        if (data.statusCode === 200 && data.data.accessToken) {
          setUser((pre) => ({ ...pre, ...data.data.user }));
          setAccessToken(data.data.accessToken);
          console.log(data.data.accessToken);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root user={user} setUser={setUser} />}>
          <Route path="/favorites" element={<FavoritesPage user={user} />} />
          <Route
            path="/auth"
            element={
              <ProtectedRoute
                isAuthenticated={user ? true : false}
                redirectTo="/recipes"
              >
                <AuthPage isAuthProp="login" setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route path="/recipes" element={<MainPage user={user} setUser={setUser}/>} />
          <Route
            path="/recipes/:id"
            element={<RecipeDetailsPage user={user} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
