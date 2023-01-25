'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class population_year_place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  population_year_place.init({
    year_id: DataTypes.INTEGER,
    place_id: DataTypes.INTEGER,
    total_population: DataTypes.BIGINT,
    served_population: DataTypes.BIGINT,
    male: DataTypes.BIGINT,
    female: DataTypes.BIGINT,
    minority: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'population_year_place',
  });
  return population_year_place;
};