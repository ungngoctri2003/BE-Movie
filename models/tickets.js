'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Seats }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Seats, { foreignKey: 'seatId', as: 'seat' })
    }
  }
  Tickets.init({
    price: DataTypes.FLOAT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Tickets',
  });
  return Tickets;
};