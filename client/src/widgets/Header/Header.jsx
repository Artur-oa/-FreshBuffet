import { NavLink, useNavigate } from 'react-router';
import UserApi from '../../entities/user/UserApi';
// import './Header.css';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await UserApi.signOut();
      if (response.statusCode === 200) {
        setUser(null);
        navigate('/');
      } else {
        alert(response.error || 'Ошибка при выходе');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка при выходе');
    }
  };

  return (
    <header className='bg-white shadow-sm border-b border-orange-100 py-4 mb-8'>
      <div className='max-w-7xl mx-auto px-6 box-border flex items-center justify-between'>
        {/* ЛОГО (слева) */}
        <div className='flex-1 basis-0'>
          <NavLink to='/' className='text-orange-600 text-xl font-bold'>
            🍽️ Лого
          </NavLink>
        </div>

        {/* НАЗВАНИЕ (по центру) */}
        <div className='flex-1 basis-0 text-center'>
          <h1 className='text-2xl font-semibold text-gray-800'>FreshBuffet</h1>
        </div>

        {/* КНОПКА (справа) */}
        <div className='flex-1 basis-0 flex justify-end'>
          {user ? (
            <button
              onClick={handleSignOut}
              className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all text-sm'
            >
              Выйти
            </button>
          ) : (
            <NavLink
              to='/auth'
              className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all text-sm'
            >
              Войти
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
