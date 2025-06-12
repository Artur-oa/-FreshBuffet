import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import UserApi from '../../entities/user/UserApi';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const data = await UserApi.logout();
      // console.log(data)
      if (data.statusCode === 200) {
        setUser(null);
        navigate('/recipes');
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
      return alert(error.response.data.error);
    }
  };

  return (
    <header className='bg-white shadow-sm border-b border-orange-100 py-4 mb-8'>
      <div className='max-w-7xl mx-auto px-6 box-border flex items-center justify-between'>
        {/* ЛОГО (слева) */}
        <div className='flex-1 basis-0'>
          <NavLink to='/recipes' className='text-lime-700 text-xl font-bold'>
            <img
              src='../../../public/assets/logo_2_3.png'
              alt='Логотип FreshBuffet'
              className='h-12 w-auto object-contain'
            />
          </NavLink>
        </div>

        {/* НАЗВАНИЕ (по центру) */}
        <div className='flex-1 basis-0 text-center'>
          <h1 className='text-3xl font-bold text-emerald-700 tracking-tight'>
            FreshBuffet
          </h1>
        </div>

        {/* КНОПКА + ИМЯ (справа) */}
        <div className='flex-1 basis-0 flex justify-end'>
          {user ? (
            <div className='flex items-center gap-6'>
              <span className='text-gray-800 text-xl font-semibold'>
                {user.name}
              </span>
              <button
                onClick={logoutHandler}
                className='bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-all text-base'
              >
                Выйти
              </button>
            </div>
          ) : (
            <NavLink
              to='/auth'
              className='bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-all text-base'
            >
              Войти
            </NavLink>
          )}
          {user && (
            <li>
              <NavLink to='/favorites'>Избранное</NavLink>
            </li>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
