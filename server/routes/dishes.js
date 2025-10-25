const express = require('express');
const router = express.Router();
const { Dish, Category } = require('../models');
const { Op } = require('sequelize');

// 获取菜品列表
router.get('/', async (req, res) => {
  try {
    const { category_id, keyword, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'active' };
    
    if (category_id) {
      where.category_id = category_id;
    }
    
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Dish.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['sort', 'ASC'], ['id', 'DESC']],
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

// 获取菜品详情
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!dish) {
      return res.status(404).json({ success: false, message: '菜品不存在' });
    }

    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

