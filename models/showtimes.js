'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShowTimes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Cinemas, Rooms, Films, Seats }) {
      // define association here
      this.belongsTo(Films, { foreignKey: 'idFilm', as: 'film' });
      this.belongsTo(Rooms, { foreignKey: 'idRoom', as: 'room' });
      this.belongsTo(Cinemas, { foreignKey: 'idCinema', as: 'cinema' });
      this.hasMany(Seats, { foreignKey: 'idShowTime', as: 'idShowTimes' });

    }
  }
  ShowTimes.init({
    showDate: DataTypes.DATE,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ShowTimes',
  });
  return ShowTimes;
};