import { useEffect, useState } from 'react';
import RecipesApi from '../entities/recipes/RecipesApi';
import { useNavigate } from 'react-router';

function MainPage({ user, myUser }) {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function getAllRecipesPaginated() {
  //     try {
  //       setLoading(true);
  //       const data = await RecipesApi.getPaginated(1);
  //       if (data.statusCode === 200) {
  //         setRecipes(data.data);
  //         if (data.data.length < 9) setNoMore(true);
  //       } else {
  //         console.error('Ошибка сервера при загрузке рецептов:', data);
  //       }
  //     } catch (error) {
  //       console.error('Ошибка загрузки рецептов:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   getAllRecipesPaginated();
  // }, []);

  useEffect(() => {
    async function getInitialRecipes() {
      try {
        setLoading(true);
        const desiredCount = 9;
        let fetchedRecipes = [];
        let currentPage = 1;
        let stillNeedData = true;

        while (fetchedRecipes.length < desiredCount && stillNeedData) {
          const data = await RecipesApi.getPaginated(currentPage);

          if (data.statusCode === 200) {
            const newRecipes = data.data;

            if (newRecipes.length === 0) {
              // Если на текущей странице ничего нет — пробуем загрузить с внешнего API
              const loadResponse = await RecipesApi.loadFromApi();

              if (loadResponse.statusCode !== 200) {
                stillNeedData = false;
                console.warn('Не удалось загрузить из внешнего API');
              }
            } else {
              fetchedRecipes.push(...newRecipes);
            }
          } else {
            stillNeedData = false;
            console.error('Ошибка при получении рецептов:', data);
          }

          currentPage++;
        }

        setRecipes(fetchedRecipes.slice(0, desiredCount));
        setPage(currentPage - 1);
        if (fetchedRecipes.length < desiredCount) setNoMore(true);
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error.message);
      } finally {
        setLoading(false);
      }
    }

    getInitialRecipes();
  }, []);

  async function loadMoreRecipes() {
    try {
      setLoading(true);
      const nextPage = page + 1;
      let data = await RecipesApi.getPaginated(nextPage);

      // Если сервер вернул пустой массив — пробуем загрузить с внешнего API
      if (data.statusCode === 200 && data.data.length === 0) {
        console.warn('Рецептов больше нет — загружаем из внешнего API...');
        const loadResult = await RecipesApi.loadFromApi();
        // Пробуем ещё раз получить данные после загрузки
        data = await RecipesApi.getPaginated(nextPage);
      }

      if (data.statusCode === 200) {
        if (data.data.length === 0) {
          setNoMore(true);
        } else {
          setRecipes(prev => [...prev, ...data.data]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error('Ошибка при подгрузке рецептов:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-4 max-w-l mx-auto'>
      {/* <div className='mb-8 text-center'>
        <h2 className='text-2xl font-light text-gray-700'>
          Привет{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        <p className='text-md text-gray-500'>
          Добро пожаловать в кулинарную книгу
        </p>
      </div> */}

      <h1 className='text-4xl font-semibold text-center text-orange-600 mb-10 tracking-tight'>
        Рецепты
      </h1>

      <div className='recipes-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className='bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-102 hover:-translate-y-1 transition-transform transition-shadow duration-300 ease-in-out p-4 flex flex-col items-center cursor-pointer'
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className='w-full h-44 object-cover rounded-md mb-3'
            />

            {/* Заголовок рецепта с прозрачностью */}
            <h2 className='text-lg font-medium text-gray-600 text-center mb-2 text-opacity-70'>
              {recipe.title}
            </h2>

            {/* Описание рецепта с прозрачностью */}
            <div className='text-sm text-gray-500 text-center space-y-1 text-opacity-70'>
              <p>
                <span className='font-semibold text-orange-400/80'>
                  Ингредиенты:
                </span>{' '}
                {recipe.ingredientCount}
              </p>
              <p>
                <span className='font-semibold text-orange-400/80'>
                  ⏰ Время:
                </span>{' '}
                {recipe.cookTime} мин
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка "Загрузить ещё" */}
      {!noMore && (
        <div className='mt-10 flex justify-center'>
          <button
            onClick={loadMoreRecipes}
            disabled={loading}
            className='bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50'
          >
            {loading ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}

      {/* Сообщение, если рецептов больше нет */}
      {noMore && (
        <p className='text-center text-gray-400 mt-6'>Больше рецептов нет</p>
      )}
    </div>
  );
}

export default MainPage;
