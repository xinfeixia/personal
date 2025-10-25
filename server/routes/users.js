const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateUser } = require('../middleware/auth');

// 获取当前用户信息
router.get('/me', authenticateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        nickname: req.user.nickname,
        avatar: req.user.avatar,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新用户信息
router.put('/me', authenticateUser, async (req, res) => {
  try {
    const { nickname, phone, address } = req.body;

    await req.user.update({
      nickname,
      phone,
      address
    });

    res.json({
      success: true,
      data: {
        id: req.user.id,
        nickname: req.user.nickname,
        avatar: req.user.avatar,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

