const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');
const { getOpenId } = require('../utils/wechat');

// 小程序用户登录
router.post('/login', async (req, res) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: '缺少code参数' });
    }

    let openid;

    // 开发环境：使用模拟的openid
    if (process.env.NODE_ENV === 'development' && code === 'test_code') {
      openid = 'test_openid_' + Date.now();
      console.log('开发模式：使用测试openid', openid);
    } else {
      // 生产环境：调用微信API获取openid
      try {
        openid = await getOpenId(code);
      } catch (error) {
        console.error('获取openid失败:', error.message);
        // 开发环境降级处理
        if (process.env.NODE_ENV === 'development') {
          openid = 'dev_openid_' + Date.now();
          console.log('开发模式降级：使用临时openid', openid);
        } else {
          throw error;
        }
      }
    }

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create({
        openid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || ''
      });
    } else if (userInfo) {
      // 更新用户信息
      await user.update({
        nickname: userInfo.nickName || user.nickname,
        avatar: userInfo.avatarUrl || user.avatar
      });
    }

    // 生成token
    const token = jwt.sign(
      { id: user.id, openid: user.openid },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理员登录
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const isValid = await admin.validatePassword(password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    if (admin.status !== 'active') {
      return res.status(401).json({ success: false, message: '账号已被禁用' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

