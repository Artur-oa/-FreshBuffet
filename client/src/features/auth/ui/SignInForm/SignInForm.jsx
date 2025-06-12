import React, { useState } from 'react';
import UserValidator from '../../../../entities/user/User.validator';
import UserApi from '../../../../entities/user/UserApi';
import { useNavigate } from 'react-router';

const INITIAL_INPUTS_DATA = {
  email: '',
  password: '',
};

export default function SignInForm({ setUser }) {
  const [inputs, setInputs] = useState(INITIAL_INPUTS_DATA);
  const navigate = useNavigate();

  const onChangeHandler = event => {
    setInputs(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async event => {
    event.preventDefault();
    const { isValid, error } = UserValidator.validateSignIn(inputs);

    if (!isValid) return alert(error);

    try {
      const {
        statusCode,
        data,
        error: responseError,
      } = await UserApi.signIn(inputs);

      if (responseError) {
        alert(responseError);
        return;
      }

      if (statusCode === 200) {
        setUser(data.user);
        setInputs(INITIAL_INPUTS_DATA);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const { email, password } = inputs;

  return (
    <form
      onSubmit={onSubmitHandler}
      className='space-y-1 w-full max-w-sm mx-auto'
    >
      <input
        type='email'
        name='email'
        placeholder='Email'
        autoFocus
        onChange={onChangeHandler}
        value={email}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400'
      />

      <input
        type='password'
        name='password'
        placeholder='Пароль'
        onChange={onChangeHandler}
        value={password}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-400'
      />

      <button
        type='submit'
        className='w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-all font-medium mt-2'
      >
        Войти
      </button>
    </form>
  );
}
