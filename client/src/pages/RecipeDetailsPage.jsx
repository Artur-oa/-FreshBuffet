import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecipesApi from '../entities/recipes/RecipesApi';
import IconStar from '../shared/ui/FavoriteIcon/IconStar';
import UserApi from '../entities/user/UserApi';


export default function RecipeDetailsPage({ user, setUser }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleFavorite(recipeId, userId) {
     try {
       if (!user) {
         alert(
           "Добавление в избранное доступно только для зарегистрированных пользователей!"
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
         throw new Error(response.message || "Ошибка при обновлении избранного");
       }
     } catch (err) {
       alert("Ошибка при обновлении избранного!");
       console.error(err);
     }
   }

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await RecipesApi.getById(id);
        setRecipe(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div>Загрузка</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!recipe) return <div>Рецепт не найден</div>;

  return (
    <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-orange-100 pb-8 pt-8 pl-10 pr-10 mt-2 mb-5 relative'>
      <h1 className='text-3xl font-bold text-center text-orange-600 mb-6 tracking-tight'>
        {recipe.title}
      </h1>

      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className='w-full h-64 object-cover rounded-lg shadow mb-6'
      />

      <div className='flex justify-between text-gray-600 text-sm mb-4 px-1'>
        <span className='font-medium'>
          ⏰ Время приготовления:{' '}
          <span className='text-gray-800'>{recipe.cookTime} мин</span>
        </span>
        <span className='font-medium'>
          🧂 Ингредиенты:{' '}
          <span className='text-gray-800'>{recipe.ingredientCount}</span>
        </span>
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-700 mb-2'>Описание</h2>
        <p className='text-gray-600 leading-relaxed'>{recipe.description}</p>
      </div>

      <div>
        <h2 className='text-xl font-semibold text-gray-700 mb-2'>
          Инструкция по приготовлению
        </h2>
        <p className='text-gray-600 leading-relaxed whitespace-pre-line'>
          {recipe.instructions}
        </p>
      </div>
      <IconStar
        isFavorite={user?.favorites?.includes(recipe.id) || false}
        onClick={(e) => {
          e.stopPropagation();
          if (!user) {
            alert(
              'Добавление в избранное доступно только для зарегистрированных пользователей!'
            );
            return;
          }
          handleFavorite(recipe.id, user.id);
        }}
        className="absolute bottom-2 right-3 z-10 transition-transform group-hover:scale-108 group-hover:text-orange-400 cursor-pointer"
      />
    </div>
  );
}
