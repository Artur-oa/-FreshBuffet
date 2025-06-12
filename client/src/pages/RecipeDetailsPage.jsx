import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipesApi from "../entities/recipes/RecipesApi";

export default function RecipeDetailsPage({ user }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div className="flex justify-between mb-4">
          <span>Время приготовления: {recipe.cookTime} мин.</span>
          <span>Ингредиентов: {recipe.ingredientCount}</span>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Описание</h2>
          <p>{recipe.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Инструкция по приготовлению</h2>
          <p>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  )
}