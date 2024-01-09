"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShowTimes, Cinemas, Seats }) {
      // define association here
      this.hasMany(ShowTimes, { foreignKey: "idRoom", as: "room" });
      this.belongsTo(Cinemas, { foreignKey: "idCinema", as: "cinema_room" });
      this.hasMany(Seats, { foreignKey: "idRoom", as: "idRooms" });
    }
  }
  Rooms.init(
    {
      roomName: DataTypes.STRING,
      maxSeat: DataTypes.INTEGER,
      size: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Rooms",
    }
  );
  return Rooms;
};
