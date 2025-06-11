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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-gray-700">
          Привет{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        <p className="text-md text-gray-500">Добро пожаловать в кулинарную книгу</p>
      </div>

      <h1 className="text-4xl font-semibold text-center text-orange-600 mb-10 tracking-tight">
        Рецепты
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center"
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-44 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-medium text-gray-800 text-center mb-2">
              {recipe.title}
            </h2>
            <div className="text-sm text-gray-600 text-center space-y-1">
              <p>
                <span className="font-semibold text-orange-500">Ингредиенты:</span>{' '}
                {recipe.ingredientCount}
              </p>
              <p>
                <span className="font-semibold text-orange-500">⏰ Время:</span>{' '}
                {recipe.cookTime} мин
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
