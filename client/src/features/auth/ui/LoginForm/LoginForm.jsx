import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserValidator } from '../../../../entities/user/User.validator';
import UserApi from '../../../../entities/user/UserApi';
import { setAccessToken } from '../../../../shared/lib/axiosInstance';
import './login_custom_button.css';

const INITIAL_INPUT_DATA = {
  email: '',
  passwordHash: '',
};

export default function LoginForm({ user, setUser }) {
  const [inputs, setInputs] = useState(INITIAL_INPUT_DATA);

  const navigate = useNavigate();

  const changeHandler = event => {
    setInputs(pre => ({ ...pre, [event.target.name]: event.target.value }));
  };

  const sumbitHandler = async e => {
    e.preventDefault();
    try {
      const { isValid, error } = UserValidator.validateLogin(inputs);

      if (isValid) {
        const data = await UserApi.login(inputs);
        if (data.statusCode === 200 && data.data.accessToken) {
          // setUsers((pre) => [...pre, data.data.user])
          setUser(pre => ({ ...pre, ...data.data.user }));
          // * сохраняем токен на клиенте
          setAccessToken(data.data.accessToken);
          navigate('/recipes');
        } else {
          //   console.log('============>>', data.response.data)
          return alert(data.response.data.error);
        }
      } else {
        console.log('Ошибка из валидатора', error);
        return alert(error);
      }
    } catch (error) {
      //   console.log('~~~~~~>>', error)
      return alert(error.response.data.error);
    }
  };

  const { email, password } = inputs;

  return (
    <form
      onSubmit={sumbitHandler}
      className='space-y-1 w-full max-w-sm mx-auto'
    >
      <input
        type='email'
        name='email'
        placeholder='Email'
        autoFocus
        onChange={changeHandler}
        value={email}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400'
      />

      <input
        type='password'
        name='passwordHash'
        placeholder='Пароль'
        onChange={changeHandler}
        value={password}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400'
      />

      <button class='login-custom-button'>Войти</button>
    </form>
  );
}
