import React from 'react';
import UserApi from '../../entities/user/UserApi';

export default function RecipeCard({ recipe, user, onFavoriteUpdate }) {
  const isFavorite = user?.favorites?.includes(recipe.id);

  async function handleFavorite() {
    if (!user) return alert('Авторизуйтесь!');
    try {
      if (isFavorite) {
        await UserApi.removeFavorite(recipe.id);
      } else {
        await UserApi.addFavorite(recipe.id);
      }
      if (onFavoriteUpdate) onFavoriteUpdate(); // для обновления списка избранного в родителе
    } catch (err) {
      alert('Ошибка при обновлении избранного!');
      console.error(err);
    }
  }

  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <button onClick={handleFavorite}>
        {isFavorite ? 'Убрать из избранного' : 'В избранное'}
      </button>
    </div>
  );
}