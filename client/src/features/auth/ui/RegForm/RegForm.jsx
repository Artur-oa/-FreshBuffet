import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserValidator } from '../../../../entities/user/User.validator';
import UserApi from '../../../../entities/user/UserApi';
import { setAccessToken } from '../../../../shared/lib/axiosInstance';

const INITIAL_INPUT_DATA = {
  name: '',
  email: '',
  passwordHash: '',
};

export default function RegForm({ setUser }) {
  const [inputs, setInputs] = useState(INITIAL_INPUT_DATA);

  const navigate = useNavigate();

  const changeHandler = event => {
    setInputs(pre => ({ ...pre, [event.target.name]: event.target.value }));
  };

  const sumbitHandler = async e => {
    e.preventDefault();
    try {
      const { isValid, error } = UserValidator.validate(inputs);

      if (isValid) {
        const data = await UserApi.register(inputs);
        console.log('------------------', data);

        if (data.statusCode === 200 && data.data.accessToken) {
          // setUsers((pre) => [...pre, data.data.user])
          setUser(pre => ({ ...pre, ...data.data.user }));
          
          // * сохраняем токен на клиенте
          setAccessToken(data.data.accessToken);
          navigate('/recipes');
        } else {
          // console.log('============>>', data.response.data);
          return alert(data.response.data.error);
        }
      } else {
        console.log('Ошибка из валидатора', error);
        return alert(error);
      }
    } catch (error) {
      console.log('~~~~~~>>', error);
      // return alert(error.response.data.error)
      if (error.response?.data?.error) {
        return alert(error.response.data.error);
      } else {
        return alert('Неизвестная ошибка. Проверь сервер и сеть.');
      }
    }
  };

  const { username, email, password } = inputs;

  return (
    <form
      onSubmit={sumbitHandler}
      className='space-y-1 w-full max-w-sm mx-auto'
    >
      <input
        type='text'
        name='name'
        placeholder='Имя пользователя'
        autoFocus
        onChange={changeHandler}
        value={username}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400'
      />

      <input
        type='email'
        name='email'
        placeholder='Email'
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

      <button
        type='submit'
        className='w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-all font-medium mt-2'
      >
        Зарегистрироваться
      </button>
    </form>
  );
}