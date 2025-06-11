import React from 'react';
import RegForm from '../features/auth/ui/RegForm/RegForm';

export default function RegPage({submitHandler, inputsHandler, inputs, user, setUser}) {
  return (
    <>
      <RegForm submitHandler={submitHandler} inputsHandler={inputsHandler} inputs={inputs} user={user} setUser={setUser}/>
    </>
  );
}
