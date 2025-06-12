import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';


import RecipeCard from '../widgets/RecipeCard/RecipeCard';
import UserApi from '../entities/user/UserApi';

export default function FavoritesPage({ user }) {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Если пользователь не авторизован — редиректим на логин
    if (!user || !user.email) {
      navigate('/auth');
      return;
    }

    // Получаем список избранных рецептов для текущего пользователя
    const fetchFavorites = async () => {
      try {
        const data = await UserApi.getFavorites(); // реализуй на стороне UserApi
        setRecipes(data || []);
      } catch (error) {
        alert('Ошибка загрузки избранного');
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  if (!user || !user.email) {
    return null; // Не показываем вообще ничего (произойдет редирект)
  }

  if (!recipes.length) {
    return <div>У вас пока нет избранных рецептов.</div>;
  }

  return (
    <div>
      <h2>Избранное</h2>
      <div className="favorites-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} user={user} />
        ))}
      </div>
    </div>
  );
}