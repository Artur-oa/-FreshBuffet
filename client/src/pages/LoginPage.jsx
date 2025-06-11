import React from 'react'
import LoginForm from '../features/auth/ui/LoginForm/LoginForm'

export default function LoginPage({loginHandler, inputsHandler, inputs, user, setUser}) {
  return (
    <div>
        <LoginForm loginHandler={loginHandler} inputsHandler={inputsHandler} inputs={inputs} user={user} setUser={setUser}/>
    </div>
  )
}