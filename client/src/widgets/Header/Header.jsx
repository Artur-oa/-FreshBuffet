import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import UserApi from '../../entities/user/UserApi';
import ThemeToggle from '../../components/ThemeToggle';

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const logoutHandler = async () => {
    try {
      const data = await UserApi.logout();
      if (data.statusCode === 200) {
        setUser(null);
        navigate('/auth');
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
      return alert(error.response.data.error);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Устанавливаем задержку закрытия
    closeTimeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 100);
  };

  return (
    <header className='bg-white shadow-sm border-b border-orange-100 py-3 relative'>
      <div className='max-w-7xl mx-auto px-8 flex items-center justify-between'>
        {/* ЛОГО (слева) */}
        <div className='flex-1'>
          <NavLink to='/recipes' className='text-lime-700 text-xl font-bold'>
            <img
              src='/assets/logo_2_4.png'
              alt='Логотип FreshBuffet'
              className='h-12 w-auto object-contain'
            />
          </NavLink>
        </div>

        {/* НАЗВАНИЕ (по центру) */}
        <NavLink to='/recipes' className='flex-1 text-center'>
          <h1 className='text-5xl font-bold text-emerald-700 tracking-tight'>
            FreshBuffet
          </h1>
        </NavLink>

        <div className='flex-1 flex justify-end items-center gap-5 relative'>
          {user?.name ? (
            <NavLink
              to='/favorites'
              className='relative inline-block text-gray-700 font-medium text-2xl max-w-[150px] truncate after:block after:h-[2px] after:bg-gray-700 after:scale-x-0 after:transition-transform after:duration-300 after:origin-center hover:after:scale-x-100'
            >
              {user.name}
            </NavLink>
          ) : (
            ''
          )}

          <ThemeToggle />

          {user ? (
            <div
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className='relative w-10 h-10 mt-2 flex items-center justify-center'>
                <span
                  className={`material-symbols-outlined absolute top-0 left-0 text-4xl text-orange-600 transition-opacity duration-300 ease-in-out ${
                    menuOpen ? 'opacity-0' : 'opacity-100'
                  } cursor-pointer`}
                >
                  menu
                </span>
                <span
                  className={`material-symbols-outlined absolute top-0 left-0 text-4xl text-orange-500 transition-opacity duration-300 ease-in-out ${
                    menuOpen ? 'opacity-100' : 'opacity-0'
                  } cursor-pointer`}
                >
                  list
                </span>
              </div>

              {menuOpen && (
                <div className='absolute right-2 top-14 w-40 bg-white border border-gray-200 rounded-md shadow-md py-0 z-50'>
                  <button
                    onClick={() => {
                      navigate('/favorites');
                      setMenuOpen(false);
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700'
                  >
                    Избранное
                  </button>

                  <button
                    onClick={() => {
                      logoutHandler();
                      setMenuOpen(false);
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-orange-100 text-red-600'
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to='/auth'
              className='bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-all text-base'
            >
              Войти
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
