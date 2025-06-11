"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      this.hasMany(models.Favorite, {
        foreignKey: "recipeId",
      });
    }
  }

  Recipe.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      instructions: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      cookTime: DataTypes.INTEGER,
      ingredientCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Recipe",
    },
  );
  return Recipe;
};
