import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ProfileEditor from '../widgets/Profile/ProfileEditor';
import RecipeCard from '../widgets/RecipeCard/RecipeCard';
import UserApi from '../entities/user/UserApi';
import useSortedFilteredRecipes from '../hooks/useSortedFilteredRecipes';

export default function FavoritesPage({ user, setUser }) {
  const [recipes, setRecipes] = useState([]);
  // const [user, setUser] = useState(initialUser || {});
  const [sortType, setSortType] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Редирект на логин если не авторизован
    if (!user || !user.email) {
      navigate('/auth');
      return;
    }
   

    // Загружаем избранные рецепты
    const fetchFavorites = async () => {
      try {
        // Если пользователь пока не загружен, не стартуем запрос на рецепты (важно!)
        if (!user?.id) return;
        // getFavorites должен возвращать массив рецептов (отредактируйте на вашем бэке по необходимости)
        const data = await UserApi.getFavorites(user.id);
        // data может быть объект с ключом data, или массив — универсально поддержим оба
        setRecipes(data?.data || data || []);
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        alert('Ошибка загрузки избранного');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      // Если у пользователя есть массив избранных — оптимистично обновляем его
      if (user?.favorites) {
        const updatedUser = {
          ...user,
          favorites: user.favorites.filter((id) => id !== recipeId),
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Не удалось удалить из избранного');
    }
  };

  const sortedRecipes = useSortedFilteredRecipes(recipes, sortType, filter);

  if (!user || !user.email) {
    return (
      <div className="p-4 max-w-l mx-auto text-center">
        <p className="text-lg text-gray-600">
          Пожалуйста, войдите в систему, чтобы просматривать избранные рецепты.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-l mx-auto">
      <ProfileEditor user={user} setUser={setUser} />
      <h1 className="text-4xl font-semibold text-center text-orange-600 mb-10 tracking-tight">
        Избранные рецепты
      </h1>
      {/* Сортировка и фильтрация */}
      <div className="mb-10 flex justify-center">
        <div className="flex flex-col sm:flex-row gap-8 bg-white/80 border border-orange-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md hover:border-orange-400 hover:ring-2 hover:ring-orange-200 transition-all">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700 mb-2">
              Сортировать по:
            </span>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-52 h-10 border border-orange-300 rounded-md px-3 bg-white text-gray-700 
        hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
        transition-all cursor-pointer"
            >
              <option value="">---</option>
              <option value="cookTimeAsc">Время приготовления ↑</option>
              <option value="cookTimeDesc">Время приготовления ↓</option>
              <option value="ingredientCountAsc">Ингредиенты ↑</option>
              <option value="ingredientCountDesc">Ингредиенты ↓</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700 mb-2">
              Фильтр:
            </span>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="введите слово или число"
              className="w-52 h-10 border border-orange-300 rounded-md px-4 text-left text-gray-700 bg-white 
        hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
        transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-center">Загрузка...</p>
      ) : sortedRecipes.length === 0 ? (
        <p className="text-center text-gray-400">
          {filter
            ? 'Ничего не найдено. Попробуйте изменить фильтр.'
            : 'У вас пока нет избранных рецептов.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              user={user}
              setUser={setUser}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}