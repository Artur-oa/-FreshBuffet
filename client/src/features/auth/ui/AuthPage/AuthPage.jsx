import React, { useState } from 'react';
import SignUpForm from '../SignUpForm/SignUpForm';
import SignInForm from '../SignInForm/SignInForm';
import './AuthPage.css';

export default function AuthPage({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className='w-full min-h-screen overflow-x-hidden flex items-center justify-center p-4'>
      <div className='w-full max-w-sm min-h-[420px] bg-white rounded-xl shadow-md px-4 py-3 flex flex-col justify-start pt-3'>
        {/* Вкладки */}
        <div className='flex justify-around mt-6 mb-8 pl-10 pr-10'>
          <button
            className={`text-lg font-semibold ${
              isSignUp
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Регистрация
          </button>
          <button
            className={`text-lg font-semibold ${
              !isSignUp
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Вход
          </button>
        </div>

        {/* Форма */}
        <div className='space-y-5 w-[80%] mx-auto'>
          {isSignUp ? (
            <SignUpForm setUser={setUser} />
          ) : (
            <SignInForm setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}
