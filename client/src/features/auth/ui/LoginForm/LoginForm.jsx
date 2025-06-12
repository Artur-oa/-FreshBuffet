import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { UserValidator } from '../../../../entities/user/User.validator'
import  UserApi  from '../../../../entities/user/UserApi'
import { setAccessToken } from '../../../../shared/lib/axiosInstance'


const INITIAL_INPUT_DATA = {
  email: '',
  passwordHash: ''
}

export default function LoginForm({ setUser}) {
  const [inputs, setInputs] = useState(INITIAL_INPUT_DATA)

  const navigate = useNavigate()
  
  const changeHandler = (event) => {
    setInputs((pre) => ({...pre, [event.target.name]: event.target.value}))
  }

  const sumbitHandler = async (e) => {
    e.preventDefault()
    try {
      const { isValid, error } = UserValidator.validateLogin(inputs)

      if (isValid) {
        const data = await UserApi.login(inputs)
        if (data.statusCode === 200 && data.data.accessToken) {
          // setUsers((pre) => [...pre, data.data.user])
          setUser((pre) => ({...pre, ...data.data.user}))
          // * сохраняем токен на клиенте
          setAccessToken(data.data.accessToken)
          navigate('/recipes')  
        } else {
        //   console.log('============>>', data.response.data)
          return alert(data.response.data.error)
        }
      } else {
        console.log('Ошибка из валидатора', error)
        return alert(error)
      }
    } catch (error) {
    //   console.log('~~~~~~>>', error)
      return alert(error.response.data.error)
    }
  }
    return (
    <>
    <form onSubmit={sumbitHandler}>
    <div>
        <div>Адрес электронной почты</div>
        <input
        name='email'
        type='email'
        required
        onChange={changeHandler}
        value={inputs.email}
        />
        <div>Пароль</div>
        <input
        name='passwordHash'
        type='password'
        required
        onChange={changeHandler}
        value={inputs.passwordHash}
        />
    </div>
    <button type='submit'>Войти</button>
    </form>
    </>
  )
}
