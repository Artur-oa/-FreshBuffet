import React from 'react';
import UserApi from '../../entities/user/UserApi';
import { useNavigate } from 'react-router';
import IconStar from '../../shared/ui/FavoriteIcon/IconStar';

export default function RecipeCard({ recipe, user, onRemove }) {
  const navigate = useNavigate();

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert('Авторизуйтесь для управления избранным!');
      return;
    }

    try {
      console.log('Removing favorite:', recipe.id); // Логируем перед удалением
      const response = await UserApi.removeFavorite(recipe.id);
      console.log('Remove response:', response); // Логируем ответ

      if (onRemove) {
        onRemove(recipe.id);
      }
    } catch (err) {
      console.error('Full error:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
        alert(
          `Ошибка: ${
            err.response.data.message || 'Не удалось удалить из избранного'
          }`
        );
      } else {
        alert('Ошибка сети при удалении из избранного');
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center relative cursor-pointer"
    >
      <IconStar
        isFavorite={true} // Всегда true для страницы избранного
        onClick={handleFavorite}
        className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform text-orange-500"
      />

      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="w-full h-44 object-cover rounded-md mb-3"
      />

      <h2 className="text-lg font-medium text-gray-600 text-center mb-2 text-opacity-70">
        {recipe.title}
      </h2>

      <div className="text-sm text-gray-500 text-center space-y-1 text-opacity-70">
        <p>
          <span className="font-semibold text-orange-400/80">Ингредиенты:</span>{' '}
          {recipe.ingredientCount}
        </p>
        <p>
          <span className="font-semibold text-orange-400/80">⏰ Время:</span>{' '}
          {recipe.cookTime} мин
        </p>
      </div>
    </div>
  );
}
