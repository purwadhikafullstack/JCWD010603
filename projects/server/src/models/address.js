"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init(
    {
      address: DataTypes.STRING,
      district: DataTypes.STRING,
      city: DataTypes.STRING,
      idCity: DataTypes.INTEGER,
      province: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      Ket: DataTypes.STRING,
      isPrimary: DataTypes.BOOLEAN,
      idCity: DataTypes.INTEGER,
      idProv: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Address",
      paranoid: true,
    }
  );
  return Address;
};
