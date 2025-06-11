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
      description: DataTypes.TEXT,
      instructions: DataTypes.TEXT,
      imageUrl: DataTypes.STRING(1000),
      cookTime: DataTypes.INTEGER,
      ingredientCount: DataTypes.INTEGER,
      apiId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Recipe",
    },
  );
  return Recipe;
};
