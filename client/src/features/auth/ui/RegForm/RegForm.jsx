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

  const changeHandler = (event) => {
    setInputs((pre) => ({ ...pre, [event.target.name]: event.target.value }));
  };

  const sumbitHandler = async (e) => {
    e.preventDefault();
    try {
      const { isValid, error } = UserValidator.validate(inputs);

      if (isValid) {
        const data = await UserApi.register(inputs);
        console.log('------------------',data);

        if (data.statusCode === 200 && data.data.accessToken) {
          // setUsers((pre) => [...pre, data.data.user])
          setUser((pre) => ({ ...pre, ...data.data.user }));
          // * сохраняем токен на клиенте
          setAccessToken(data.data.accessToken);
          navigate('/');
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

  return (
    <>
      <form onSubmit={sumbitHandler}>
        <div>
          <div>Имя</div>
          <input
            name="name"
            type="text"
            required
            onChange={changeHandler}
            value={inputs.name}
          />
          <div>Адрес электронной почты</div>
          <input
            name="email"
            type="email"
            required
            onChange={changeHandler}
            value={inputs.email}
          />
          <div>Пароль</div>
          <input
            name="passwordHash"
            type="passwordHash"
            required
            onChange={changeHandler}
            value={inputs.passwordHash}
          />
        </div>
        <button type="submit">Зарегестрироваться</button>
      </form>
    </>
  );
}
