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


function App() {
  // const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    passwordHash: '',
  });

  const [user, setUser] = useState({});

  const [validateError, setValidateError] = useState('');

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const { isValid, error } = UserValidator.validate(inputs);

      if (isValid) {
        const data = await UserApi.register(inputs);
        if (data.statusCode === 200 && data.data.accessToken) {
          setUsers((users) => [...users, data.data.user]);
          setInputs({
            name: '',
            email: '',
            passwordHash: '',
          });
          setValidateError('');
        } else {
          console.log(error);
        }
      } else {
        setValidateError(error);
        console.log('Ошибка из валидатора', error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loginHandler(e) {
    e.preventDefault();
    try {
      const { isValid, error } = UserValidator.validateLogin(inputs);

      if (isValid) {
        const data = await UserApi.login(inputs);
        if (data.statusCode === 200 && data.data.accessToken) {
          setUsers((users) => [...users, data.data.user]);
          setInputs({
            email: '',
            passwordHash: '',
          });
          setValidateError('');
        } else {
          console.log(error);
        }
      } else {
        setValidateError(error);
        console.log('Ошибка из валидатора', error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function inputsHandler(e) {
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    // console.log('Зашли в useEffect');
    const getUser = async () => {
      try {
        const data = await UserApi.refresh();
        // console.log('refresh data:+++++++++++++++++', data);
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
        <Route path="/" element={<Root user={user} setUser={setUser} />} >
          {/* <Route
            path="/избранное"
            element={
              <ProtectedRoute
                isAuthenticated={!user.login ? true : false}
                redirectTo="/"
              >
                <AuthPage user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/auth"
            element={
              <ProtectedRoute
                isAuthenticated={user.login ? true : false}
                redirectTo="/recipes"
              >
                <AuthPage isAuthProp="login" setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <ProtectedRoute
                isAuthenticated={user.login ? true : false}
                redirectTo="/recipes"
              >
                <AuthPage
                  isAuthProp="register"
                  setUser={setUser}
                  setUsers={setUsers}
                />
              </ProtectedRoute>
            }
          />
          <Route path='/recipes' element={<MainPage user={user} />} />
          <Route path='/recipes/:id' element={<RecipeDetailsPage user={user} />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
