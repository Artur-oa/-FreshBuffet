import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import RecipeCard from '../widgets/RecipeCard/RecipeCard';
import UserApi from '../entities/user/UserApi';
import useSortedFilteredRecipes from '../hooks/useSortedFilteredRecipes';

const recipesData = [
  {
    id: 1,
    title: 'Борщ',
    description:
      'Шоколадно-апельсиновые мадленки могут стать отличным дополнением к вашему набору рецептов десертов.',
    instructions: `Разогрейте духовку до 374F,
        Форму для печенья "Мадлен" смажьте маслом и обильно посыпьте мукой.
        В небольшой миске смешайте муку, разрыхлитель и соль.
        Взбейте вместе и отложите в сторону.`,
    cookTime: 20,
    ingredientCount: 5,
  },
  {
    id: 2,
    title: 'Каша',
    description:
      'Шоколадно-апельсиновые мадленки могут стать отличным дополнением к вашему набору рецептов десертов.',
    instructions: `Разогрейте духовку до 374F,
        Форму для печенья "Мадлен" смажьте маслом и обильно посыпьте мукой.
        В небольшой миске смешайте муку, разрыхлитель и соль.
        Взбейте вместе и отложите в сторону.`,
    cookTime: 15,
    ingredientCount: 3,
    ingredients: ['овсянка', 'молоко', 'соль'],
  },
];

export default function FavoritesPage({ user }) {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Если пользователь не авторизован — редиректим на логин
    if (!user || !user.email) {
      navigate('/auth');
      return;
    }

    // Получаем список избранных рецептов для текущего пользователя
    const fetchFavorites = async () => {
      try {
        const data = await UserApi.getFavorites();
        setRecipes(data && data.length ? data : []); // если с сервера нет данных, отдаём []
      } catch (error) {
        alert('Ошибка загрузки избранного');
        // Для тестов можно раскомментировать:
        // setRecipes(recipesData);
      }
    };
    fetchFavorites();
  }, [user, navigate]);

  const sortedRecipes = useSortedFilteredRecipes(recipes, sortType, filter);

  if (!user || !user.email) {
    return null; // Не показываем вообще ничего (произойдет редирект)
  }

  if (!recipes.length) {
    return <div>У вас пока нет избранных рецептов.</div>;
  }

  return (
    <div>
      <h2>Избранное</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Сортировать по:&nbsp;
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">---</option>
            <option value="cookTimeAsc">Время приготовления ↑</option>
            <option value="cookTimeDesc">Время приготовления ↓</option>
            <option value="ingredientCountAsc">Кол-во ингредиентов ↑</option>
            <option value="ingredientCountDesc">Кол-во ингредиентов ↓</option>
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Фильтр (слово или число):&nbsp;
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="введите слово или число"
          />
        </label>
      </div>
      <div className="favorites-list">
        {sortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} user={user} />
        ))}
      </div>
    </div>
  );
}
