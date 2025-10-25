const app = getApp()

Page({
  data: {
    cart: {},
    cartItems: [],
    totalPrice: 0,
    orderType: 'delivery', // dine_in 或 delivery
    tableNumber: '',
    serveTimeOptions: ['立即上菜', '15分钟后', '30分钟后', '1小时后'],
    serveTimeIndex: 0,
    contactName: '',
    contactPhone: '',
    deliveryAddress: '',
    remark: '',
    submitting: false
  },

  onShow() {
    this.loadCart()
    this.loadUserInfo()
  },

  // 加载购物车
  loadCart() {
    const cart = wx.getStorageSync('cart') || {}
    const cartItems = Object.values(cart).filter(item => item.count > 0)
    
    let totalPrice = 0
    cartItems.forEach(item => {
      totalPrice += item.dish.price * item.count
    })
    
    this.setData({
      cart,
      cartItems,
      totalPrice: totalPrice.toFixed(2)
    })
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        contactName: userInfo.nickname || '',
        contactPhone: userInfo.phone || '',
        deliveryAddress: userInfo.address || ''
      })
    }
  },

  // 增加数量
  increaseCount(e) {
    const id = e.currentTarget.dataset.id
    const cart = this.data.cart
    
    if (cart[id]) {
      cart[id].count++
      this.updateCart(cart)
    }
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
      this.updateCart(cart)
    }
  },

  // 更新购物车
  updateCart(cart) {
    wx.setStorageSync('cart', cart)
    this.loadCart()
  },

  // 选择订单类型
  selectOrderType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ orderType: type })
  },

  // 输入事件
  onTableNumberInput(e) {
    this.setData({ tableNumber: e.detail.value })
  },

  onServeTimeChange(e) {
    this.setData({ serveTimeIndex: e.detail.value })
  },

  onContactNameInput(e) {
    this.setData({ contactName: e.detail.value })
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value })
  },

  onDeliveryAddressInput(e) {
    this.setData({ deliveryAddress: e.detail.value })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  // 提交订单
  async submitOrder() {
    const {
      cartItems, orderType, tableNumber, serveTimeOptions, serveTimeIndex,
      contactName, contactPhone, deliveryAddress, remark
    } = this.data

    // 堂食模式验证
    if (orderType === 'dine_in') {
      if (!tableNumber) {
        wx.showToast({ title: '请输入桌号', icon: 'none' })
        return
      }
    }

    // 外卖模式验证
    if (orderType === 'delivery') {
      if (!contactName) {
        wx.showToast({ title: '请输入联系人', icon: 'none' })
        return
      }

      if (!contactPhone) {
        wx.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }

      if (!deliveryAddress) {
        wx.showToast({ title: '请输入配送地址', icon: 'none' })
        return
      }
    }

    // 检查登录状态
    if (!app.globalData.token) {
      try {
        await app.login()
      } catch (error) {
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        return
      }
    }

    const items = cartItems.map(item => ({
      dish_id: item.dish.id,
      quantity: item.count
    }))

    // 构建订单数据
    const orderData = {
      items,
      order_type: orderType,
      remark
    }

    // 根据订单类型添加不同字段
    if (orderType === 'dine_in') {
      orderData.table_number = tableNumber
      orderData.serve_time = serveTimeOptions[serveTimeIndex]
    } else {
      orderData.contact_name = contactName
      orderData.contact_phone = contactPhone
      orderData.delivery_address = deliveryAddress
    }

    try {
      this.setData({ submitting: true })

      const result = await app.request({
        url: '/orders',
        method: 'POST',
        data: orderData
      })

      // 清空购物车
      wx.removeStorageSync('cart')

      // 所有订单都需要发起支付
      this.requestPayment(result.order_id)
    } catch (error) {
      console.error(error)
    } finally {
      this.setData({ submitting: false })
    }
  },

  // 发起支付
  async requestPayment(orderId) {
    try {
      const paymentData = await app.request({
        url: '/payment/create',
        method: 'POST',
        data: { order_id: orderId }
      })

      wx.requestPayment({
        ...paymentData,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' })
          setTimeout(() => {
            wx.switchTab({ url: '/pages/order/order' })
          }, 1500)
        },
        fail: () => {
          wx.showModal({
            title: '提示',
            content: '支付已取消，您可以在订单页面继续支付',
            success: (res) => {
              if (res.confirm) {
                wx.switchTab({ url: '/pages/order/order' })
              }
            }
          })
        }
      })
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: '订单创建成功，但支付失败，您可以在订单页面继续支付',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/order/order' })
          }
        }
      })
    }
  }
})

