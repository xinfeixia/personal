const app = getApp()

Page({
  data: {
    categories: [],
    dishes: [],
    currentCategory: null,
    cart: {}, // { dishId: { dish, count } }
    totalCount: 0,
    totalPrice: 0
  },

  onLoad() {
    this.loadCategories()
    this.loadCart()
  },

  onShow() {
    this.loadCart()
  },

  // 加载分类
  async loadCategories() {
    try {
      const categories = await app.request({
        url: '/categories'
      })
      this.setData({
        categories,
        currentCategory: categories[0]?.id
      })
      this.loadDishes()
    } catch (error) {
      console.error(error)
    }
  },

  // 加载菜品
  async loadDishes() {
    try {
      wx.showLoading({ title: '加载中...' })
      const params = this.data.currentCategory ? `?category_id=${this.data.currentCategory}` : ''
      const result = await app.request({
        url: `/dishes${params}`
      })
      
      // 合并购物车数量
      const dishes = result.list.map(dish => ({
        ...dish,
        count: this.data.cart[dish.id]?.count || 0
      }))
      
      this.setData({ dishes })
    } catch (error) {
      console.error(error)
    } finally {
      wx.hideLoading()
    }
  },

  // 选择分类
  selectCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentCategory: id })
    this.loadDishes()
  },

  // 增加数量
  increaseCount(e) {
    const id = e.currentTarget.dataset.id
    const dish = this.data.dishes.find(d => d.id === id)
    
    if (!dish) return
    
    const cart = this.data.cart
    if (cart[id]) {
      cart[id].count++
    } else {
      cart[id] = { dish, count: 1 }
    }
    
    this.updateCart(cart)
  },

  // 减少数量
  decreaseCount(e) {
    const id = e.currentTarget.dataset.id
    const cart = this.data.cart
    
    if (cart[id]) {
      cart[id].count--
      if (cart[id].count <= 0) {
        delete cart[id]
      }
    }
    
    this.updateCart(cart)
  },

  // 更新购物车
  updateCart(cart) {
    let totalCount = 0
    let totalPrice = 0
    
    Object.values(cart).forEach(item => {
      totalCount += item.count
      totalPrice += item.dish.price * item.count
    })
    
    // 更新菜品数量
    const dishes = this.data.dishes.map(dish => ({
      ...dish,
      count: cart[dish.id]?.count || 0
    }))
    
    this.setData({
      cart,
      dishes,
      totalCount,
      totalPrice: totalPrice.toFixed(2)
    })
    
    // 保存到本地
    wx.setStorageSync('cart', cart)
  },

  // 加载购物车
  loadCart() {
    const cart = wx.getStorageSync('cart') || {}
    this.updateCart(cart)
  },

  // 去购物车
  goToCart() {
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '购物车是空的',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  }
})

