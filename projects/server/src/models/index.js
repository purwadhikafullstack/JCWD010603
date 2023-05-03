'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.admin = require("./admin")(sequelize,Sequelize)
db.branch = require("./branch")(sequelize,Sequelize)
db.user = require("./user")(sequelize,Sequelize)
db.user_detail = require("./user_detail")(sequelize,Sequelize)
db.address = require("./address")(sequelize,Sequelize)
db.product = require("./product")(sequelize,Sequelize)
db.category = require("./category")(sequelize,Sequelize)
db.cart = require("./cart")(sequelize,Sequelize)
db.voucher = require("./voucher")(sequelize,Sequelize)
db.voucher_type = require("./voucher_type")(sequelize,Sequelize)
db.transaction_header = require("./transaction_header")(sequelize,Sequelize)
db.transaction_item = require("./transaction_item")(sequelize,Sequelize)
db.type_stock = require("./type_stock")(sequelize,Sequelize)
db.record_stock = require("./record_stock")(sequelize,Sequelize)
db.discount = require("./discount")(sequelize,Sequelize)
db.transaction_status = require("./transaction_status")(sequelize,Sequelize)

// associate
db.admin.belongsTo(db.branch)
db.branch.hasOne(db.admin)

db.user_detail.belongsTo(db.user)
db.user.hasOne(db.user_detail)
db.address.belongsTo(db.user)

db.user.hasMany(db.address)
db.product.belongsTo(db.category)

db.category.hasMany(db.product)
db.user.hasMany(db.address)

db.product.belongsTo(db.branch)
db.branch.hasMany(db.product)

db.cart.belongsTo(db.product)
db.cart.belongsTo(db.user)
db.user.hasMany(db.cart)
db.product.hasMany(db.cart)

db.voucher.belongsTo(db.branch)
db.branch.hasMany(db.voucher)
db.voucher.belongsTo(db.product)
db.product.hasMany(db.voucher)
db.voucher.belongsTo(db.voucher_type)
db.voucher_type.hasMany(db.voucher)

db.transaction_header.belongsTo(db.branch)
db.transaction_header.belongsTo(db.user)
db.branch.hasMany(db.transaction_header)
db.user.hasMany(db.transaction_header)

db.transaction_item.belongsTo(db.product)
db.product.hasMany(db.transaction_item)
db.transaction_item.belongsTo(db.transaction_header)
db.transaction_header.hasMany(db.transaction_item)
db.transaction_header.belongsTo(db.transaction_status)
db.transaction_status.hasMany(db.transaction_header)


db.record_stock.belongsTo(db.type_stock)
db.type_stock.hasMany(db.record_stock)
db.record_stock.belongsTo(db.product)
db.product.hasMany(db.record_stock)

db.record_stock.belongsTo(db.branch)
db.branch.hasMany(db.record_stock)

db.discount.belongsTo(db.product)
db.product.hasMany(db.discount)


module.exports = db;
