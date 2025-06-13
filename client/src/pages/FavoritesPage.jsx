import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import RecipeCard from '../widgets/RecipeCard/RecipeCard';
import UserApi from '../entities/user/UserApi';
import useSortedFilteredRecipes from '../hooks/useSortedFilteredRecipes';


export default function FavoritesPage({ user, setUser }) {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если пользователь не авторизован — редиректим на логин
    if (!user || !user.email) {
      navigate('/auth');
      return;
    }

    // Получаем список избранных рецептов для текущего пользователя
    const fetchFavorites = async () => {
      try {

        const data = await Promise.any([
          UserApi.getFavorites(user.id),
          
        ]);
        
        setRecipes(data.data ||  data || []);
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
      // Оптимистичное обновление UI
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      // Обновляем состояние пользователя
      if (user?.favorites) {
        const updatedUser = {
          ...user,
          favorites: user.favorites.filter(id => id !== recipeId)
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
      <h1 className="text-4xl font-semibold text-center text-orange-600 mb-10 tracking-tight">
        Избранные рецепты
      </h1>

      {/* Блок сортировки и фильтрации */}
      <div className="mb-8 p-4 bg-orange-50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <label className="flex items-center">
            <span className="mr-2 text-gray-700">Сортировать по:</span>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border border-orange-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">---</option>
              <option value="cookTimeAsc">Время приготовления ↑</option>
              <option value="cookTimeDesc">Время приготовления ↓</option>
              <option value="ingredientCountAsc">Кол-во ингредиентов ↑</option>
              <option value="ingredientCountDesc">Кол-во ингредиентов ↓</option>
            </select>
          </label>
          <label className="flex items-center">
            <span className="mr-2 text-gray-700">Фильтр:</span>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="введите слово или число"
              className="border border-orange-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </div>
      

      {loading ? (
        <p className="text-center">Загрузка...</p>
      ) : sortedRecipes.length === 0 ? (
        <p className="text-center text-gray-400">
          {filter 
            ? 'Ничего не найдено. Попробуйте изменить фильтр.' 
            : 'У вас пока нет избранных рецептов.'
          }
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {sortedRecipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          user={user} 
          setUser={setUser}
          onRemove={handleRemoveFavorite}  // Передаем обработчик удаления
        />
      ))}
    </div>
      )}
    </div>
  );
}
