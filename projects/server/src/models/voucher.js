"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Voucher.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      nominal: DataTypes.INTEGER,
      presentase: DataTypes.STRING,
      expiredDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Voucher",
      paranoid: true,
    }
  );
  return Voucher;
};
