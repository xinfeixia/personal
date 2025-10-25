const { sequelize } = require('../models')

async function migrate() {
  try {
    console.log('开始迁移订单表...')

    // 检查并添加 order_type 字段
    try {
      await sequelize.query(`
        ALTER TABLE orders
        ADD COLUMN order_type ENUM('dine_in', 'delivery')
        DEFAULT 'delivery'
        NOT NULL
        COMMENT '订单类型：dine_in-堂食，delivery-外卖'
        AFTER user_id
      `)
      console.log('✓ 添加 order_type 字段')
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('- order_type 字段已存在，跳过')
      } else {
        throw error
      }
    }

    // 检查并添加 table_number 字段
    try {
      await sequelize.query(`
        ALTER TABLE orders
        ADD COLUMN table_number VARCHAR(20)
        COMMENT '桌号（堂食时使用）'
        AFTER order_type
      `)
      console.log('✓ 添加 table_number 字段')
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('- table_number 字段已存在，跳过')
      } else {
        throw error
      }
    }

    // 检查并添加 serve_time 字段
    try {
      await sequelize.query(`
        ALTER TABLE orders
        ADD COLUMN serve_time VARCHAR(50)
        COMMENT '上菜时间（堂食时使用）'
        AFTER table_number
      `)
      console.log('✓ 添加 serve_time 字段')
    } catch (error) {
      if (error.original?.errno === 1060) {
        console.log('- serve_time 字段已存在，跳过')
      } else {
        throw error
      }
    }

    console.log('\n迁移完成！')
    process.exit(0)
  } catch (error) {
    console.error('迁移失败:', error.message)
    process.exit(1)
  }
}

migrate()

