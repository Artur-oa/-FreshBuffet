import useSortedFilteredRecipes from '../../hooks/useSortedFilteredRecipes';
import { useEffect, useRef, useState } from 'react';
import RecipesApi from '../../entities/recipes/RecipesApi';
import { useNavigate } from 'react-router';
import IconStar from '../../shared/ui/FavoriteIcon/IconStar';
import UserApi from '../../entities/user/UserApi';
import './MainPage.css';

function MainPage({ user, myUser, setUser }) {
  const [recipes, setRecipes] = useState([]); // все рецепты
  const [recommendedRecipes, setRecommendedRecipes] = useState([]); // 10 рекомендуемых рецептов
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [sortType, setSortType] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  /* Горизонтальный скролл колесиком мыши:
     При наведении на блок с карточками рекомендуемых рецептов
     вертикальное колесо мыши будет работать как горизонтальное,
     создавая smooth UX без появления горизонтального скроллбара */
  useEffect(() => {
    if (recommendedRecipes.length === 0) return;

    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = e => {
      if (e.deltaY !== 0) {
        e.preventDefault(); // отменяем вертикальный скролл
        el.scrollLeft += e.deltaY; // вместо этого прокручиваем по горизонтали
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => el.removeEventListener('wheel', handleWheel);
  }, [recommendedRecipes]);

  /* Получаем отсортированные и отфильтрованные рецепты */
  const sortedRecipes = useSortedFilteredRecipes(recipes, sortType, filter);

  /* Получение из БД рандомных (Рекомендуемых) рецептов */
  useEffect(() => {
    async function getPopularRecipes() {
      try {
        const data = await RecipesApi.getRandomRecipes();

        if (data.statusCode === 200) {
          setRecommendedRecipes(data.data);
        }
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error.message);
      }
    }
    getPopularRecipes();
  }, []);

  /* Первоначальная загрузка рецептов на странице */
  useEffect(() => {
    async function getInitialRecipes() {
      try {
        setLoading(true);

        // Пробуем получить первую страницу рецептов
        const data = await RecipesApi.getPaginated(1);

        if (data.statusCode === 200 && data.data.length > 0) {
          // Если есть рецепты — сохраняем их
          setRecipes(data.data.slice(0, 9));
          setPage(1);
          if (data.data.length < 9) setNoMore(true);
        } else {
          // Если ничего нет — пробуем загрузить с внешнего API
          const loadResponse = await RecipesApi.loadFromApi();

          if (loadResponse.statusCode === 200) {
            // Повторно загружаем рецепты после успешной загрузки
            const retry = await RecipesApi.getPaginated(1);
            if (retry.statusCode === 200 && retry.data.length > 0) {
              setRecipes(retry.data.slice(0, 9));
              setPage(1);
              if (retry.data.length < 9) {
                setNoMore(true);
              }
            } else {
              setNoMore(true);
              console.warn(
                'Данные так и не появились после загрузки из внешнего API'
              );
            }
          } else {
            setNoMore(true);
            console.warn('Не удалось загрузить из внешнего API');
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error.message);
      } finally {
        setLoading(false);
      }
    }

    getInitialRecipes();
  }, []);

  /* Пагинация: загрузка следующей страницы рецептов */
  async function loadMoreRecipes() {
    try {
      setLoading(true);
      const nextPage = page + 1;
      let data = await RecipesApi.getPaginated(nextPage);

      // Если сервер вернул пустой массив — пробуем загрузить с внешнего API
      if (data.statusCode === 200 && data.data.length === 0) {
        console.warn('Рецептов больше нет — загружаем из внешнего API...');
        const loadResult = await RecipesApi.loadFromApi();
        // Пробуем ещё раз получить данные после загрузки
        data = await RecipesApi.getPaginated(nextPage);
      }

      if (data.statusCode === 200) {
        if (data.data.length === 0) {
          setNoMore(true);
        } else {
          setRecipes(prev => [...prev, ...data.data]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error('Ошибка при подгрузке рецептов:', error);
    } finally {
      setLoading(false);
    }
  }

  /* Избранное */
  async function handleFavorite(recipeId, userId) {
    try {
      if (!user) {
        alert(
          'Добавление в избранное доступно только для зарегистрированных пользователей!'
        );
        return;
      }

      if (!user.favorites) {
        user.favorites = [];
      }

      let response;
      if (user.favorites.includes(recipeId)) {
        response = await UserApi.removeFavorite(recipeId, userId);
      } else {
        response = await UserApi.addFavorite(recipeId, userId);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Обновляем список избранного у пользователя только после успешного ответа от сервера
        const updatedUser = { ...user };
        if (user.favorites.includes(recipeId)) {
          updatedUser.favorites = updatedUser.favorites.filter(
            id => id !== recipeId
          );
        } else {
          updatedUser.favorites = [...updatedUser.favorites, recipeId];
        }
        setUser(updatedUser);
      } else {
        throw new Error(response.message || 'Ошибка при обновлении избранного');
      }
    } catch (err) {
      alert('Ошибка при обновлении избранного!');
      console.error(err);
    }
  }

  /* Для кастомной формы сортировки */
  const SORT_OPTIONS = [
    { value: '', label: '---' },
    { value: 'cookTimeAsc', label: 'Время ↑' },
    { value: 'cookTimeDesc', label: 'Время ↓' },
    { value: 'ingredientCountAsc', label: 'Ингредиенты ↑' },
    { value: 'ingredientCountDesc', label: 'Ингредиенты ↓' },
  ];

  /* Для кликов вне поля сортировки с последующим закрытие меню сортировки */
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    }

    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  return (
    <div className='p-8 max-w-l mx-auto'>
      {recommendedRecipes.length > 0 && (
        <div className='mb-12'>
          <h1 className='text-4xl font-semibold text-center text-orange-600 mb-7 tracking-tight'>
            Рекомендуемые рецепты
          </h1>

          {/* ОБЕРТКА: Ограничиваем ширину и центрируем */}
          <div className='max-w-3xl mx-auto px-3'>
            <div className='overflow-x-auto scrollbar-hide' ref={scrollRef}>
              <div className='flex gap-6 pb-2 min-w-fit'>
                {recommendedRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                    className='w-[230px] bg-white border border-orange-200 rounded-xl shadow-md
                    p-3 flex-shrink-0 cursor-pointer
                    hover:shadow-xl hover:border-orange-400 hover:ring-1 hover:ring-orange-200
                    transition-all duration-300'
                  >
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className='w-full h-32 object-cover rounded-md mb-2'
                    />
                    <h3 className='text-base font-semibold text-gray-700 mb-1 text-center line-clamp-2'>
                      {recipe.title}
                    </h3>
                    <p className='text-sm text-gray-500 text-center'>
                      ⏰ {recipe.cookTime} мин · 🥗 {recipe.ingredientCount} шт.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Заголовок */}
      <h1 className='text-4xl font-semibold text-center text-orange-600 mb-7 tracking-tight'>
        Рецепты
      </h1>

      {/* Форма сортировки и фильтрации */}
      <div className='mb-10 flex justify-center'>
        <div className='flex flex-col sm:flex-row gap-8 bg-white/80 border border-orange-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md hover:border-orange-400 hover:ring-2 hover:ring-orange-200 transition-all'>
          {/* Кастомная сортировка */}
          <div className='relative flex flex-col items-center' ref={sortRef}>
            <span className='custom-text text-sm font-medium text-gray-700 mb-2'>
              Сортировать по:
            </span>
            <button
              onClick={() => setSortDropdownOpen(prev => !prev)}
              className='button-reset w-52 h-10 border border-orange-300 rounded-md px-2 text-left text-gray-700 bg-white
             hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 flex items-center justify-between transition-all cursor-pointer'
            >
              <span className=''>
                {SORT_OPTIONS.find(opt => opt.value === sortType)?.label ||
                  '---'}
              </span>
              <span className='material-symbols-outlined icon-small text-gray-500'>
                {sortDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
            {sortDropdownOpen && (
              <div className='absolute top-full mt-1 w-52 bg-white border border-orange-200 rounded-md shadow z-15'>
                {SORT_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSortType(option.value);
                      setSortDropdownOpen(false);
                    }}
                    className='px-4 py-2 text-sm hover:bg-orange-50 cursor-pointer'
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Фильтр */}
          <div className='flex flex-col items-center'>
            <span className='custom-text text-sm font-medium text-gray-700 mb-2'>
              Фильтр:
            </span>
            <input
              type='text'
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder='Найти по слову'
              className='input-reset w-52 h-10 border border-orange-300 rounded-md px-4 text-left text-gray-700 bg-white 
             hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
             transition-all cursor-pointer'
            />
          </div>
        </div>
      </div>

      {/* Карточки (рецепты) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {sortedRecipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className='w-[300px] group bg-white border border-orange-200 rounded-xl shadow-md
              p-4 flex flex-col items-center relative cursor-pointer
              transition-transform duration-300 ease-out
              hover:-translate-y-1 hover:scale-[1] hover:shadow-2xl
              hover:border-orange-400
              hover:ring-1 hover:ring-orange-200'
          >
            <IconStar
              isFavorite={user?.favorites?.includes(recipe.id) || false}
              onClick={e => {
                e.stopPropagation();
                if (!user) {
                  alert(
                    'Добавление в избранное доступно только для зарегистрированных пользователей!'
                  );
                  return;
                }
                handleFavorite(recipe.id, user.id);
              }}
              className='absolute bottom-2 right-3 z-10 transition-transform group-hover:scale-108 group-hover:text-orange-400 cursor-pointer'
            />

            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className='w-[94%] h-44 object-cover rounded-md mb-4 mt-2'
            />

            {/* Заголовок рецепта с прозрачностью */}
            <h2 className='text-lg font-medium text-gray-600 text-center mb-2 text-opacity-70'>
              {recipe.title}
            </h2>

            {/* Описание рецепта с прозрачностью */}
            <div className='text-sm text-gray-500 text-center space-y-1 text-opacity-70'>
              <p>
                <span className='font-semibold text-orange-400/80'>
                  Ингредиенты:
                </span>{' '}
                {recipe.ingredientCount} шт.
              </p>
              <p>
                <span className='font-semibold text-orange-400/80'>Время:</span>{' '}
                {recipe.cookTime} мин
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка Загрузить ещё */}
      {!noMore && sortedRecipes.length > 0 && (
        <div className='mt-10 flex justify-center'>
          <button
            onClick={loadMoreRecipes}
            disabled={loading}
            className='bg-orange-400 text-white px-5 py-2 rounded-lg hover:bg-orange-500 text-lg 
             transform transition-transform duration-200 cursor-pointer'
          >
            {loading ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
      {sortedRecipes.length === 0 && !loading && (
        <p className='text-center text-gray-400 mt-6'>
          {filter
            ? 'Ничего не найдено. Попробуйте изменить фильтр.'
            : 'Рецептов пока нет.'}
        </p>
      )}
      {noMore && sortedRecipes.length > 0 && (
        <p className='text-center text-gray-400 mt-6'>Больше рецептов нет</p>
      )}
    </div>
  );
}

export default MainPage;
