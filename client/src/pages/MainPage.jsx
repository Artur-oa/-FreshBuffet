import useSortedFilteredRecipes from '../hooks/useSortedFilteredRecipes';
import { useEffect, useState } from "react";
import RecipesApi from "../entities/recipes/RecipesApi";
import { useNavigate } from "react-router";
import IconStar from "../shared/ui/FavoriteIcon/IconStar";
import UserApi from "../entities/user/UserApi";


function MainPage({ user, myUser, setUser }) {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [sortType, setSortType] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  // Получаем отсортированные и отфильтрованные рецепты
  const sortedRecipes = useSortedFilteredRecipes(recipes, sortType, filter);

  useEffect(() => {
    async function getAllRecipesPaginated() {
      try {
        setLoading(true);
        const data = await RecipesApi.getPaginated(1);
        if (data.statusCode === 200) {
          setRecipes(data.data);
          if (data.data.length < 9) setNoMore(true);
        } else {
          console.error("Ошибка сервера при загрузке рецептов:", data);
        }
      } catch (error) {
        console.error("Ошибка загрузки рецептов:", error);
      } finally {
        setLoading(false);
      }
    }

    getAllRecipesPaginated();
  }, []);

  async function loadMoreRecipes() {
    try {
      setLoading(true);
      const nextPage = page + 1;
      let data = await RecipesApi.getPaginated(nextPage);

      // Если сервер вернул пустой массив — пробуем загрузить с внешнего API
      if (data.statusCode === 200 && data.data.length === 0) {
        console.warn("Рецептов больше нет — загружаем из внешнего API...");
        const loadResult = await RecipesApi.loadFromApi();
        // Пробуем ещё раз получить данные после загрузки
        data = await RecipesApi.getPaginated(nextPage);
      }

      if (data.statusCode === 200) {
        if (data.data.length === 0) {
          setNoMore(true);
        } else {
          setRecipes((prev) => [...prev, ...data.data]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error("Ошибка при подгрузке рецептов:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFavorite(recipeId, userId) {
    try {
    if (!user) {
      alert("Добавление в избранное доступно только для зарегистрированных пользователей!");
      return;
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    let response;
    if (user.favorites.includes(recipeId)) {
      response = await UserApi.removeFavorite(recipeId);
    } else {
      response = await UserApi.addFavorite(recipeId, userId);
    }

    if (response.statusCode === 200 || response.statusCode === 201) {
      // Обновляем список избранного у пользователя только после успешного ответа от сервера
      const updatedUser = { ...user };
      if (user.favorites.includes(recipeId)) {
        updatedUser.favorites = updatedUser.favorites.filter(id => id !== recipeId);
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
    <div className="p-4 max-w-l mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-gray-700">
          Привет{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        <p className="text-md text-gray-500">
          Добро пожаловать в кулинарную книгу
        </p>
      </div>

      <h1 className="text-4xl font-semibold text-center text-orange-600 mb-10 tracking-tight">
        Рецепты
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sortedRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center"
          >
            <IconStar
              isFavorite={user?.favorites?.includes(recipe.id) || false}
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  alert(
                    "Добавление в избранное доступно только для зарегестрированных пользователей!"
                  );
                  return;
                }
                handleFavorite(recipe.id, user.id);
              }}
              className="absolute top-2 right-2 z-10"
            />

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
                <span className="font-semibold text-orange-500">
                  Ингредиенты:
                </span>{" "}
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

      {/* Кнопка "Загрузить ещё" */}
      {!noMore && sortedRecipes.length > 0 &&(
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMoreRecipes}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Загрузить ещё"}
          </button>
        </div>
      )}

      {sortedRecipes.length === 0 && !loading && (
        <p className='text-center text-gray-400 mt-6'>
          {filter ? 'Ничего не найдено. Попробуйте изменить фильтр.' : 'Рецептов пока нет.'}
        </p>
      )}

      {/* Сообщение, если рецептов больше нет */}
      {noMore && sortedRecipes.length > 0 &&(
        <p className="text-center text-gray-400 mt-6">Больше рецептов нет</p>
      )}
    </div>
  );
}

export default MainPage;
