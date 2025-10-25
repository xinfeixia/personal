const { sequelize, Category, Dish } = require('../models')

async function seedData() {
  try {
    console.log('开始添加示例数据...')

    // 创建分类
    const categories = await Category.bulkCreate([
      {
        name: '热菜',
        icon: 'https://via.placeholder.com/100/ff6b6b/ffffff?text=热菜',
        sort: 1,
        status: 'active'
      },
      {
        name: '凉菜',
        icon: 'https://via.placeholder.com/100/4ecdc4/ffffff?text=凉菜',
        sort: 2,
        status: 'active'
      },
      {
        name: '主食',
        icon: 'https://via.placeholder.com/100/ffe66d/ffffff?text=主食',
        sort: 3,
        status: 'active'
      },
      {
        name: '汤品',
        icon: 'https://via.placeholder.com/100/a8e6cf/ffffff?text=汤品',
        sort: 4,
        status: 'active'
      },
      {
        name: '饮料',
        icon: 'https://via.placeholder.com/100/95e1d3/ffffff?text=饮料',
        sort: 5,
        status: 'active'
      },
      {
        name: '甜品',
        icon: 'https://via.placeholder.com/100/f38181/ffffff?text=甜品',
        sort: 6,
        status: 'active'
      }
    ])

    console.log(`✓ 已创建 ${categories.length} 个分类`)

    // 创建菜品
    const dishes = await Dish.bulkCreate([
      // 热菜
      {
        category_id: categories[0].id,
        name: '宫保鸡丁',
        description: '经典川菜，鸡肉鲜嫩，花生酥脆，酸甜微辣',
        price: 38.00,
        original_price: 48.00,
        image: 'https://via.placeholder.com/400/ff6b6b/ffffff?text=宫保鸡丁',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[0].id,
        name: '鱼香肉丝',
        description: '色泽红亮，咸甜酸辣兼备，肉丝细嫩',
        price: 32.00,
        original_price: 42.00,
        image: 'https://via.placeholder.com/400/ff6b6b/ffffff?text=鱼香肉丝',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[0].id,
        name: '红烧肉',
        description: '肥而不腻，入口即化，色泽红亮诱人',
        price: 45.00,
        original_price: 55.00,
        image: 'https://via.placeholder.com/400/ff6b6b/ffffff?text=红烧肉',
        stock: 100,
        sort: 3,
        status: 'active'
      },
      {
        category_id: categories[0].id,
        name: '麻婆豆腐',
        description: '麻辣鲜香，豆腐嫩滑，下饭神器',
        price: 28.00,
        image: 'https://via.placeholder.com/400/ff6b6b/ffffff?text=麻婆豆腐',
        stock: 100,
        sort: 4,
        status: 'active'
      },
      {
        category_id: categories[0].id,
        name: '糖醋里脊',
        description: '外酥里嫩，酸甜可口，老少皆宜',
        price: 36.00,
        image: 'https://via.placeholder.com/400/ff6b6b/ffffff?text=糖醋里脊',
        stock: 100,
        sort: 5,
        status: 'active'
      },

      // 凉菜
      {
        category_id: categories[1].id,
        name: '夫妻肺片',
        description: '麻辣鲜香，色泽红亮，质地软嫩',
        price: 32.00,
        image: 'https://via.placeholder.com/400/4ecdc4/ffffff?text=夫妻肺片',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[1].id,
        name: '凉拌黄瓜',
        description: '清爽开胃，酸辣适中，夏日必备',
        price: 12.00,
        image: 'https://via.placeholder.com/400/4ecdc4/ffffff?text=凉拌黄瓜',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[1].id,
        name: '口水鸡',
        description: '鸡肉鲜嫩，麻辣鲜香，令人垂涎',
        price: 35.00,
        image: 'https://via.placeholder.com/400/4ecdc4/ffffff?text=口水鸡',
        stock: 100,
        sort: 3,
        status: 'active'
      },
      {
        category_id: categories[1].id,
        name: '拍黄瓜',
        description: '简单美味，清脆爽口，蒜香浓郁',
        price: 10.00,
        image: 'https://via.placeholder.com/400/4ecdc4/ffffff?text=拍黄瓜',
        stock: 100,
        sort: 4,
        status: 'active'
      },

      // 主食
      {
        category_id: categories[2].id,
        name: '扬州炒饭',
        description: '粒粒分明，配料丰富，色香味俱全',
        price: 18.00,
        image: 'https://via.placeholder.com/400/ffe66d/ffffff?text=扬州炒饭',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[2].id,
        name: '米饭',
        description: '香软可口的米饭',
        price: 3.00,
        image: 'https://via.placeholder.com/400/ffe66d/ffffff?text=米饭',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[2].id,
        name: '手工水饺',
        description: '皮薄馅大，鲜美多汁，手工制作',
        price: 25.00,
        image: 'https://via.placeholder.com/400/ffe66d/ffffff?text=手工水饺',
        stock: 100,
        sort: 3,
        status: 'active'
      },
      {
        category_id: categories[2].id,
        name: '葱油拌面',
        description: '面条劲道，葱香四溢，简单美味',
        price: 15.00,
        image: 'https://via.placeholder.com/400/ffe66d/ffffff?text=葱油拌面',
        stock: 100,
        sort: 4,
        status: 'active'
      },

      // 汤品
      {
        category_id: categories[3].id,
        name: '番茄蛋汤',
        description: '酸甜开胃，营养丰富，家常美味',
        price: 12.00,
        image: 'https://via.placeholder.com/400/a8e6cf/ffffff?text=番茄蛋汤',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[3].id,
        name: '紫菜蛋花汤',
        description: '清淡鲜美，营养健康',
        price: 10.00,
        image: 'https://via.placeholder.com/400/a8e6cf/ffffff?text=紫菜蛋花汤',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[3].id,
        name: '酸辣汤',
        description: '酸辣开胃，浓郁鲜香',
        price: 15.00,
        image: 'https://via.placeholder.com/400/a8e6cf/ffffff?text=酸辣汤',
        stock: 100,
        sort: 3,
        status: 'active'
      },

      // 饮料
      {
        category_id: categories[4].id,
        name: '可口可乐',
        description: '经典碳酸饮料，冰爽畅快',
        price: 5.00,
        image: 'https://via.placeholder.com/400/95e1d3/ffffff?text=可乐',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[4].id,
        name: '雪碧',
        description: '清爽柠檬味，透心凉',
        price: 5.00,
        image: 'https://via.placeholder.com/400/95e1d3/ffffff?text=雪碧',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[4].id,
        name: '鲜榨橙汁',
        description: '新鲜橙子现榨，维C满满',
        price: 15.00,
        image: 'https://via.placeholder.com/400/95e1d3/ffffff?text=橙汁',
        stock: 100,
        sort: 3,
        status: 'active'
      },
      {
        category_id: categories[4].id,
        name: '柠檬水',
        description: '清新柠檬，解渴消暑',
        price: 8.00,
        image: 'https://via.placeholder.com/400/95e1d3/ffffff?text=柠檬水',
        stock: 100,
        sort: 4,
        status: 'active'
      },

      // 甜品
      {
        category_id: categories[5].id,
        name: '红豆双皮奶',
        description: '奶香浓郁，口感细腻，甜而不腻',
        price: 18.00,
        image: 'https://via.placeholder.com/400/f38181/ffffff?text=双皮奶',
        stock: 100,
        sort: 1,
        status: 'active'
      },
      {
        category_id: categories[5].id,
        name: '芒果班戟',
        description: '新鲜芒果，奶油香滑，甜蜜诱人',
        price: 22.00,
        image: 'https://via.placeholder.com/400/f38181/ffffff?text=芒果班戟',
        stock: 100,
        sort: 2,
        status: 'active'
      },
      {
        category_id: categories[5].id,
        name: '提拉米苏',
        description: '意式经典，浓郁咖啡香，入口即化',
        price: 28.00,
        image: 'https://via.placeholder.com/400/f38181/ffffff?text=提拉米苏',
        stock: 100,
        sort: 3,
        status: 'active'
      },
      {
        category_id: categories[5].id,
        name: '冰淇淋球',
        description: '多种口味可选，清凉解暑',
        price: 12.00,
        image: 'https://via.placeholder.com/400/f38181/ffffff?text=冰淇淋',
        stock: 100,
        sort: 4,
        status: 'active'
      }
    ])

    console.log(`✓ 已创建 ${dishes.length} 个菜品`)
    console.log('\n示例数据添加完成！')
    console.log('\n分类统计：')
    categories.forEach(cat => {
      const count = dishes.filter(d => d.category_id === cat.id).length
      console.log(`  - ${cat.name}: ${count} 个菜品`)
    })

    process.exit(0)
  } catch (error) {
    console.error('添加示例数据失败:', error)
    process.exit(1)
  }
}

seedData()

