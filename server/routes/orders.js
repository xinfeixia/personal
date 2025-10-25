const express = require('express');
const router = express.Router();
const { Order, OrderItem, Dish, User } = require('../models');
const { authenticateUser } = require('../middleware/auth');
const moment = require('moment');

// 创建订单
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      items, order_type, table_number, serve_time,
      remark, contact_name, contact_phone, delivery_address
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: '订单商品不能为空' });
    }

    // 验证订单类型特定字段
    if (order_type === 'dine_in') {
      if (!table_number) {
        return res.status(400).json({ success: false, message: '堂食订单需要提供桌号' });
      }
    } else if (order_type === 'delivery') {
      if (!contact_name) {
        return res.status(400).json({ success: false, message: '外卖订单需要提供联系人' });
      }
      if (!contact_phone) {
        return res.status(400).json({ success: false, message: '外卖订单需要提供联系电话' });
      }
      if (!delivery_address) {
        return res.status(400).json({ success: false, message: '外卖订单需要提供配送地址' });
      }
    }

    // 计算总金额
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const dish = await Dish.findByPk(item.dish_id);

      if (!dish || dish.status !== 'active') {
        return res.status(400).json({ success: false, message: `菜品${item.dish_id}不存在或已下架` });
      }

      if (dish.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `菜品${dish.name}库存不足` });
      }

      const subtotal = dish.price * item.quantity;
      totalAmount += parseFloat(subtotal);

      orderItems.push({
        dish_id: dish.id,
        dish_name: dish.name,
        dish_image: dish.image,
        price: dish.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // 生成订单号
    const orderNo = `ORD${moment().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 10000)}`;

    // 创建订单数据
    const orderData = {
      order_no: orderNo,
      user_id: req.user.id,
      order_type: order_type || 'delivery',
      total_amount: totalAmount,
      status: 'pending', // 所有订单都需要先支付
      remark
    };

    // 根据订单类型添加特定字段
    if (order_type === 'dine_in') {
      orderData.table_number = table_number;
      orderData.serve_time = serve_time;
    } else {
      orderData.contact_name = contact_name;
      orderData.contact_phone = contact_phone;
      orderData.delivery_address = delivery_address;
    }

    // 创建订单
    const order = await Order.create(orderData);

    // 创建订单项
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        ...item
      });
    }

    // 更新库存
    for (const item of items) {
      await Dish.decrement('stock', {
        by: item.quantity,
        where: { id: item.dish_id }
      });
    }

    res.json({
      success: true,
      data: {
        order_id: order.id,
        order_no: order.order_no,
        order_type: order.order_type,
        total_amount: order.total_amount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取用户订单列表
router.get('/my', authenticateUser, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: req.user.id };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取订单详情
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 取消订单
router.post('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: '订单状态不允许取消' });
    }

    await order.update({ status: 'cancelled' });

    // 恢复库存
    const items = await OrderItem.findAll({ where: { order_id: order.id } });
    for (const item of items) {
      await Dish.increment('stock', {
        by: item.quantity,
        where: { id: item.dish_id }
      });
    }

    res.json({ success: true, message: '订单已取消' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

