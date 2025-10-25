const express = require('express');
const router = express.Router();
const { Category, Dish } = require('../models');

// 获取分类列表
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { status: 'active' },
      order: [['sort', 'ASC'], ['id', 'ASC']],
      include: [{
        model: Dish,
        as: 'dishes',
        where: { status: 'active' },
        required: false,
        attributes: ['id', 'name', 'image', 'price', 'original_price', 'sales']
      }]
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Dish,
        as: 'dishes',
        where: { status: 'active' },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

