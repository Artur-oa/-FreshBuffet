import React, { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import UserApi from '../../entities/user/UserApi';

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

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
    <header className="bg-white shadow-sm border-b border-orange-100 py-2 mb-2 relative">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* ЛОГО (слева) */}
        <div className="flex-1">
          <NavLink to="/recipes" className="text-lime-700 text-xl font-bold">
            <img
              src="/assets/logo_2_4.png"
              alt="Логотип FreshBuffet"
              className="h-12 w-auto object-contain"
            />
          </NavLink>
        </div>

        {/* НАЗВАНИЕ (по центру) */}
        <div className="flex-1 text-center">
          <h1 className="text-5xl font-bold text-emerald-700 tracking-tight">
            FreshBuffet
          </h1>
        </div>

        {/* БУРГЕР-МЕНЮ (справа) */}
        <div className="flex-1 flex justify-end relative">
          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter} // навел курсор на элемент
              onMouseLeave={handleMouseLeave} // отвел курсор
            >
              {/* <button className='text-xl text-orange-600 font-semibold hover:underline'> */}
              <span className="material-symbols-outlined text-4xl">menu</span>
              {/* </button> */}

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/favorites');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700"
                  >
                    Избранное
                  </button>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-100 text-red-600"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-all text-base"
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
