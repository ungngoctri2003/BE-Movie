'use strict';
const {
  Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cinemas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Rooms, GroupCinemas, ShowTimes }) {
      // define association here
      this.belongsTo(GroupCinemas, { foreignKey: 'idGroupCinema', as: 'group' });
      this.hasMany(Rooms, { foreignKey: 'idCinema', as: 'cinema_room' });
      this.hasMany(ShowTimes, { foreignKey: 'idCinema', as: 'cinema_showTime' })
    }
  }
  Cinemas.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    logo: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Cinemas',
  });
  return Cinemas;
};