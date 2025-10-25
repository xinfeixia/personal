const { sequelize, Admin } = require('../models');
require('dotenv').config();

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');

    // 同步数据库表结构
    await sequelize.sync({ force: true });
    console.log('数据库表结构创建成功');

    // 创建默认管理员账号
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      name: '系统管理员',
      email: 'admin@example.com',
      status: 'active'
    });
    console.log('默认管理员账号创建成功');
    console.log('用户名: admin');
    console.log('密码: admin123');

    console.log('数据库初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();

