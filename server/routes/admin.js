const express = require('express');
const router = express.Router();
const { Category, Dish, Order, OrderItem, User } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 文件上传
router.post('/upload', authenticateAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请选择文件' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url: fileUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== 分类管理 ==========

// 获取分类列表
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sort', 'ASC'], ['id', 'ASC']]
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建分类
router.post('/categories', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新分类
router.put('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    await category.update(req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除分类
router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    
    // 检查是否有关联菜品
    const dishCount = await Dish.count({ where: { category_id: req.params.id } });
    if (dishCount > 0) {
      return res.status(400).json({ success: false, message: '该分类下有菜品，无法删除' });
    }
    
    await category.destroy();
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== 菜品管理 ==========

// 获取菜品列表
router.get('/dishes', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, category_id, keyword } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category_id) where.category_id = category_id;
    if (keyword) where.name = { [Op.like]: `%${keyword}%` };

    const { count, rows } = await Dish.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['sort', 'ASC'], ['id', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建菜品
router.post('/dishes', authenticateAdmin, async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新菜品
router.put('/dishes/:id', authenticateAdmin, async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: '菜品不存在' });
    }
    await dish.update(req.body);
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除菜品
router.delete('/dishes/:id', authenticateAdmin, async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: '菜品不存在' });
    }
    await dish.destroy();
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== 订单管理 ==========

// 获取订单列表
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, order_no } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (order_no) where.order_no = order_no;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'nickname', 'phone'] },
        { model: OrderItem, as: 'items' }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新订单状态
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    
    await order.update({ status });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== 统计数据 ==========

// 获取统计数据
router.get('/statistics', authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalUsers = await User.count();
    const totalDishes = await Dish.count();
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.count({
      where: { created_at: { [Op.gte]: todayStart } }
    });
    
    const todayRevenue = await Order.sum('total_amount', {
      where: { 
        status: 'paid',
        paid_at: { [Op.gte]: todayStart }
      }
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalDishes,
        todayOrders,
        todayRevenue: todayRevenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

