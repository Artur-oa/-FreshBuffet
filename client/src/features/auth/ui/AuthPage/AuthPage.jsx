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
    // Контейнер всей страницы авторизации
    <div className='w-full min-h-screen overflow-x-hidden flex items-center justify-center p-4'>
      <div className='w-full max-w-sm min-h-[420px] bg-white rounded-xl shadow-md px-4 py-3 flex flex-col justify-start pt-3'>
        {/* Вкладки */}
        <div className='flex justify-around mt-6 mb-8 pl-10 pr-10'>
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
        <div className='space-y-5 w-[80%] mx-auto'>
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