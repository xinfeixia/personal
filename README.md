# 🍜 餐饮小程序完整系统

一个功能完整的餐饮点餐系统，支持堂食和外卖两种模式，包含微信小程序端、后端服务和管理后台。

## ✨ 功能特性

### 📱 微信小程序端
- **双模式点餐**
  - 🍽️ **堂食模式**：选择桌号、上菜时间，无需填写联系方式
  - 🚚 **外卖模式**：填写配送地址、联系人信息
- **菜品浏览**：分类展示、搜索、详情查看
- **购物车管理**：添加、修改数量、删除
- **订单管理**：订单列表、订单详情、订单状态跟踪
- **微信支付**：统一支付流程（堂食和外卖都需支付）
- **用户中心**：个人信息管理

### 💻 管理后台
- **数据统计**：订单统计、销售额统计
- **分类管理**：添加、编辑、删除菜品分类
- **菜品管理**：菜品的增删改查、库存管理、图片上传
- **订单管理**：订单列表、订单详情、状态更新
- **管理员管理**：管理员账号管理

### 🔧 后端服务
- **RESTful API**：标准化接口设计
- **JWT 认证**：安全的用户认证机制
- **微信登录**：集成微信小程序登录
- **微信支付**：集成微信支付功能
- **文件上传**：支持图片上传
- **数据库管理**：MySQL 数据持久化

## 🛠️ 技术栈

### 后端
- **Node.js** - 运行环境
- **Express** - Web 框架
- **Sequelize** - ORM 框架
- **MySQL** - 数据库
- **JWT** - 身份认证
- **Multer** - 文件上传
- **Axios** - HTTP 客户端

### 管理后台
- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Element Plus** - UI 组件库
- **Pinia** - 状态管理
- **Vue Router** - 路由管理

### 微信小程序
- **原生小程序开发**
- **微信 API**（登录、支付、请求等）

## 📁 项目结构

```
lunch/
├── server/                 # 后端服务
│   ├── config/            # 配置文件
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── scripts/           # 脚本（初始化、迁移、种子数据）
│   ├── utils/             # 工具函数
│   ├── uploads/           # 上传文件目录
│   ├── app.js             # 应用入口
│   ├── package.json       # 依赖配置
│   └── .env.example       # 环境变量示例
│
├── admin/                 # 管理后台
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # 状态管理
│   │   ├── utils/        # 工具函数
│   │   ├── views/        # 页面组件
│   │   ├── App.vue       # 根组件
│   │   └── main.js       # 入口文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── miniprogram/           # 微信小程序
│   ├── pages/            # 页面
│   │   ├── index/       # 首页（菜品列表）
│   │   ├── cart/        # 购物车
│   │   ├── order/       # 订单列表
│   │   ├── order-detail/# 订单详情
│   │   └── user/        # 个人中心
│   ├── images/          # 图片资源
│   ├── app.js           # 小程序入口
│   ├── app.json         # 小程序配置
│   ├── app.wxss         # 全局样式
│   └── project.config.json
│
└── README.md             # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- MySQL >= 5.7
- 微信开发者工具

### 1. 克隆项目
```bash
git clone https://github.com/xinfeixia/personal.git
cd personal
```

### 2. 配置数据库

创建 MySQL 数据库：
```sql
CREATE DATABASE lunch_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置后端

```bash
cd server

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库密码等信息
# DB_PASSWORD=your_mysql_password
# JWT_SECRET=your_random_secret_key

# 初始化数据库表
npm run init-db

# 添加示例数据（可选）
npm run seed

# 启动后端服务
npm run dev
```

后端服务将运行在 `http://localhost:3001`

### 4. 配置管理后台

```bash
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

管理后台将运行在 `http://localhost:8080`

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

### 5. 配置微信小程序

1. 使用微信开发者工具打开 `miniprogram` 目录
2. 配置 AppID（或使用测试号）
3. 在"详情" → "本地设置"中勾选：
   - ✅ 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书
4. 编译运行

## ⚙️ 配置说明

### 后端环境变量 (server/.env)

```env
# 服务器端口
PORT=3001

# JWT 密钥（请生成随机字符串）
JWT_SECRET=your_jwt_secret_key_here

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lunch_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# 微信小程序配置
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret

# 微信支付配置（生产环境需要）
WECHAT_MCH_ID=your_merchant_id
WECHAT_PAY_KEY=your_payment_key
```

### 小程序配置 (miniprogram/app.js)

开发环境使用 `http://localhost:3001/api`

生产环境需要修改为实际的 HTTPS 域名：
```javascript
baseUrl: 'https://your-domain.com/api'
```

## 📖 使用说明

### 堂食模式流程
1. 用户浏览菜品，添加到购物车
2. 进入购物车，选择"堂食"模式
3. 填写桌号（如：A01）
4. 选择上菜时间（立即/15分钟后/30分钟后/1小时后）
5. 提交订单并支付
6. 支付成功后，订单进入制作状态

### 外卖模式流程
1. 用户浏览菜品，添加到购物车
2. 进入购物车，选择"外卖"模式
3. 填写联系人、电话、配送地址
4. 提交订单并支付
5. 支付成功后，订单进入配送流程

### 管理后台操作
1. 登录管理后台
2. 在"分类管理"中添加菜品分类
3. 在"菜品管理"中添加菜品、上传图片、设置价格
4. 在"订单管理"中查看和处理订单
5. 更新订单状态（待支付 → 已支付 → 制作中 → 已完成）

## 📊 数据库表结构

- **users** - 用户表（微信用户）
- **admins** - 管理员表
- **categories** - 分类表
- **dishes** - 菜品表
- **orders** - 订单表
- **order_items** - 订单项表

## 🔒 安全说明

- ✅ 密码使用 bcrypt 加密存储
- ✅ JWT Token 认证
- ✅ 敏感信息使用环境变量
- ✅ .gitignore 排除 .env 和 node_modules
- ⚠️ 生产环境请修改默认管理员密码
- ⚠️ 生产环境请使用强随机 JWT_SECRET

## 📝 开发说明

### 添加新的 API 接口
1. 在 `server/routes/` 中创建路由文件
2. 在 `server/app.js` 中注册路由
3. 使用 `authenticateUser` 或 `authenticateAdmin` 中间件保护接口

### 添加新的数据模型
1. 在 `server/models/` 中创建模型文件
2. 在 `server/models/index.js` 中导出模型
3. 运行初始化脚本创建表

### 数据库迁移
```bash
cd server
node scripts/migrate-order-type.js  # 示例：添加订单类型字段
```

## 🐛 常见问题

**Q: 端口 3001 被占用？**
A: 修改 `server/.env` 中的 PORT，同时修改 `admin/vite.config.js` 和 `miniprogram/app.js` 中的对应端口

**Q: 微信登录失败？**
A: 开发环境会自动使用测试账号，生产环境需要配置真实的 WECHAT_APPID 和 WECHAT_SECRET

**Q: 图片上传失败？**
A: 确保 `server/uploads/` 目录存在且有写入权限

**Q: 小程序请求失败？**
A: 检查微信开发者工具是否勾选"不校验合法域名"

## 📄 License

MIT

## 👥 作者

xinfeixia

## 🙏 致谢

感谢所有开源项目的贡献者！

