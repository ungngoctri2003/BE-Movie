"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `modelsss/index` file will call this method automatically.
     */
    static associate({ Rooms, ShowTimes, Users, Tickets }) {
      // define association here
      this.belongsTo(ShowTimes, {
        foreignKey: "idShowTime",
        as: "idShowTimes",
      });
      this.belongsTo(Rooms, { foreignKey: "idRoom", as: "idRooms" });
      this.belongsTo(Users, { foreignKey: "idUser", as: "idUsers" });
      this.hasMany(Tickets, { foreignKey: "seatId", as: "seat" });
    }
  }
  Seats.init(
    {
      seatName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keepSeat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bookded: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Seats",
    }
  );
  return Seats;
};
