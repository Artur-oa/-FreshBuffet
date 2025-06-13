import React from 'react';
import UserApi from '../../entities/user/UserApi';
import { useNavigate } from 'react-router';
import IconStar from '../../shared/ui/FavoriteIcon/IconStar';

export default function RecipeCard({ recipe, user, setUser}) {
  const navigate = useNavigate();

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

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center relative cursor-pointer"
    >
      {/* <IconStar
        isFavorite={true} // Всегда true для страницы избранного
        onClick={handleFavorite}
        className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform text-orange-500"
      /> */}

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
