'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupCinemas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Cinemas }) {
      // define association here
      this.hasMany(Cinemas, { foreignKey: 'idGroupCinema', as: 'group' });
    }
  }
  GroupCinemas.init({
    groupName: DataTypes.STRING,
    logo: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GroupCinemas',
  });
  return GroupCinemas;
};