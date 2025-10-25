// 下载 TabBar 图标的脚本
// 使用方法: node download-icons.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  {
    name: 'home.png',
    url: 'https://img.icons8.com/ios/100/999999/home--v1.png'
  },
  {
    name: 'home-active.png',
    url: 'https://img.icons8.com/ios-filled/100/ff6b6b/home--v1.png'
  },
  {
    name: 'order.png',
    url: 'https://img.icons8.com/ios/100/999999/purchase-order.png'
  },
  {
    name: 'order-active.png',
    url: 'https://img.icons8.com/ios-filled/100/ff6b6b/purchase-order.png'
  },
  {
    name: 'user.png',
    url: 'https://img.icons8.com/ios/100/999999/user--v1.png'
  },
  {
    name: 'user-active.png',
    url: 'https://img.icons8.com/ios-filled/100/ff6b6b/user--v1.png'
  },
  {
    name: 'cart.png',
    url: 'https://img.icons8.com/ios-filled/100/ff6b6b/shopping-cart--v1.png'
  },
  {
    name: 'empty-cart.png',
    url: 'https://img.icons8.com/ios/200/cccccc/shopping-cart--v1.png'
  },
  {
    name: 'empty-order.png',
    url: 'https://img.icons8.com/ios/200/cccccc/purchase-order.png'
  },
  {
    name: 'default-avatar.png',
    url: 'https://img.icons8.com/ios-filled/100/cccccc/user-male-circle.png'
  },
  {
    name: 'status-pending.png',
    url: 'https://img.icons8.com/ios/100/ff9800/clock--v1.png'
  },
  {
    name: 'status-paid.png',
    url: 'https://img.icons8.com/ios-filled/100/4caf50/checkmark--v1.png'
  },
  {
    name: 'status-preparing.png',
    url: 'https://img.icons8.com/ios/100/2196f3/cooking.png'
  },
  {
    name: 'status-completed.png',
    url: 'https://img.icons8.com/ios-filled/100/9e9e9e/ok--v1.png'
  },
  {
    name: 'status-cancelled.png',
    url: 'https://img.icons8.com/ios/100/f44336/cancel--v1.png'
  },
  {
    name: 'order-icon.png',
    url: 'https://img.icons8.com/ios/100/ff6b6b/purchase-order.png'
  },
  {
    name: 'profile-icon.png',
    url: 'https://img.icons8.com/ios/100/ff6b6b/user--v1.png'
  },
  {
    name: 'about-icon.png',
    url: 'https://img.icons8.com/ios/100/ff6b6b/info--v1.png'
  }
];

const imagesDir = path.join(__dirname, 'images');

// 确保 images 目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

console.log('开始下载图标...\n');

let completed = 0;
let failed = 0;

icons.forEach(icon => {
  const filePath = path.join(imagesDir, icon.name);
  const file = fs.createWriteStream(filePath);

  https.get(icon.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      completed++;
      console.log(`✓ ${icon.name} 下载成功`);
      
      if (completed + failed === icons.length) {
        console.log(`\n下载完成！成功: ${completed}, 失败: ${failed}`);
      }
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    failed++;
    console.log(`✗ ${icon.name} 下载失败: ${err.message}`);
    
    if (completed + failed === icons.length) {
      console.log(`\n下载完成！成功: ${completed}, 失败: ${failed}`);
    }
  });
});

