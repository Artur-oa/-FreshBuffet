import { useEffect, useState } from 'react';
import RecipesApi from '../entities/recipes/RecipesApi';

function MainPage({ user }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function getAllRecipes() {
      try {
        const data = await RecipesApi.getAll();

        if (data.statusCode === 200) {
          setRecipes(data.data);
        } else {
          console.error('Ошибка в ответе сервера RecipesApi.getAll', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке всех рецептов', error);
      }
    }
    getAllRecipes();
  }, []);

  return (
    <div className='p-6'>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-medium text-gray-800">
          Привет {user?.name ? `, ${user.name}` : ''} 👋 
        </h2>
        <h2 className="text-xl font-medium text-gray-800">
          Добро пожаловать в кулинарную книгу!
        </h2>
      </div>

      <h1 className='text-3xl font-bold text-center mb-8'>Рецепты</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {recipes.map(recipe => (
          <div
          key={recipe.id}
          className="bg-lime-50 border border-lime-200 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-all duration-300"
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h2 className="text-lg font-semibold mb-2 text-center text-green-700">
            {recipe.title}
          </h2>
          <div className="text-sm text-gray-800 text-center">
            <p className="mb-1">
              <strong>Ингредиенты:</strong> {recipe.ingredientCount}
            </p>
            <p>
              <strong>⏰ Время приготовления:</strong> {recipe.cookTime} мин
            </p>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
