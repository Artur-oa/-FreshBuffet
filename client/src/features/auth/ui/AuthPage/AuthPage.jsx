// Импорт React и хука useState
import React, { useState } from 'react';

// Импорт компонентов форм регистрации и входа
import RegForm from '../RegForm/RegForm';
import LoginForm from '../LoginForm/LoginForm';

// Импорт CSS-стилей для оформления страницы
import './AuthPage.css';

// Главный компонент страницы авторизации
export default function AuthPage({ setMyUser, setUser }) {
  // Локальное состояние, которое определяет, показывать форму регистрации (true) или входа (false)
  const [isReg, setIsReg] = useState(true);

  return (
    <div className='flex flex-col items-center justify-center grow'>
      <div className='w-full max-w-sm bg-white rounded-xl shadow-md px-10 py-6 flex flex-col items-center'>
        {/* Вкладки */}
        <div className='flex justify-around w-full mb-6'>
          <button
            className={`text-lg font-semibold ${
              isReg
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setIsReg(true)}
          >
            Регистрация
          </button>
          <button
            className={`text-lg font-semibold ${
              !isReg
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setIsReg(false)}
          >
            Вход
          </button>
        </div>

        {/* Форма */}
        <div className='space-y-4 w-full'>
          {isReg ? (
            <RegForm setUser={setUser} setMyUser={setMyUser} />
          ) : (
            <LoginForm setUser={setUser} setMyUser={setMyUser} />
          )}
        </div>
      </div>
    </div>
  );
}
