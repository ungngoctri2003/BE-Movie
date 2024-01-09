'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.hasMany(Users, { foreignKey: "typeUser", as: 'type_user' })
    }
  }
  TypeUser.init({
    nameType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TypeUser',
  });
  return TypeUser;
};