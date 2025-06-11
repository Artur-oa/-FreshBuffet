// Импорт React и хука useState
import React, { useState } from 'react';

// Импорт компонентов форм регистрации и входа
import RegForm from '../RegForm/RegForm';
import LoginForm from '../LoginForm/LoginForm';

// Импорт CSS-стилей для оформления страницы
import './AuthPage.css';

// Главный компонент страницы авторизации
export default function AuthPage({ setUser }) {
  // Локальное состояние, которое определяет, показывать форму регистрации (true) или входа (false)
  const [isReg, setIsReg] = useState(true);

  return (
    // Контейнер всей страницы авторизации
    <div className='auth-page'>
      <div className='auth-container'>
        
        {/* Кнопки-переключатели вкладок */}
        <div className='auth-tabs'>
          <button
            className={`auth-tab ${isReg ? 'active' : ''}`}
            onClick={() => setIsReg(true)}
          >
            Регистрация
          </button>
          <button
            className={`auth-tab ${!isReg ? 'active' : ''}`}
            onClick={() => setIsReg(false)}
          >
            Вход
          </button>
        </div>

        {/* Отображение нужной формы */}
        {isReg ? (
          <RegForm setUser={setUser} />
        ) : (
          <LoginForm setUser={setUser} />
        )}
      </div>
    </div>
  );
}