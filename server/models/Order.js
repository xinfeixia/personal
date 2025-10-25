const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_no: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: '订单号'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  order_type: {
    type: DataTypes.ENUM('dine_in', 'delivery'),
    defaultValue: 'delivery',
    allowNull: false,
    comment: '订单类型：dine_in-堂食，delivery-外卖'
  },
  table_number: {
    type: DataTypes.STRING(20),
    comment: '桌号（堂食时使用）'
  },
  serve_time: {
    type: DataTypes.STRING(50),
    comment: '上菜时间（堂食时使用）'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '总金额'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'preparing', 'completed', 'cancelled'),
    defaultValue: 'pending',
    comment: '订单状态'
  },
  payment_method: {
    type: DataTypes.STRING(20),
    comment: '支付方式'
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    comment: '微信支付交易号'
  },
  paid_at: {
    type: DataTypes.DATE,
    comment: '支付时间'
  },
  remark: {
    type: DataTypes.TEXT,
    comment: '备注'
  },
  contact_name: {
    type: DataTypes.STRING(50),
    comment: '联系人'
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    comment: '联系电话'
  },
  delivery_address: {
    type: DataTypes.TEXT,
    comment: '配送地址'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;

