const sequelize = require('../config/database');
const User = require('./User');
const Admin = require('./Admin');
const Category = require('./Category');
const Dish = require('./Dish');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// 定义关联关系
Category.hasMany(Dish, { foreignKey: 'category_id', as: 'dishes' });
Dish.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

OrderItem.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

module.exports = {
  sequelize,
  User,
  Admin,
  Category,
  Dish,
  Order,
  OrderItem
};

