const app = getApp()

Page({
  data: {
    tabs: [
      { label: '全部', value: '' },
      { label: '待支付', value: 'pending' },
      { label: '已支付', value: 'paid' },
      { label: '制作中', value: 'preparing' },
      { label: '已完成', value: 'completed' }
    ],
    currentTab: '',
    orders: []
  },

  onShow() {
    this.checkLogin()
  },

  // 检查登录
  async checkLogin() {
    if (!app.globalData.token) {
      try {
        await app.login()
        this.loadOrders()
      } catch (error) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          showCancel: false
        })
      }
    } else {
      this.loadOrders()
    }
  },

  // 加载订单
  async loadOrders() {
    try {
      wx.showLoading({ title: '加载中...' })
      const params = this.data.currentTab ? `?status=${this.data.currentTab}` : ''
      const result = await app.request({
        url: `/orders/my${params}`
      })
      this.setData({ orders: result.list })
    } catch (error) {
      console.error(error)
    } finally {
      wx.hideLoading()
    }
  },

  // 切换标签
  switchTab(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ currentTab: value })
    this.loadOrders()
  },

  // 获取状态文本
  getStatusText(status) {
    const map = {
      pending: '待支付',
      paid: '已支付',
      preparing: '制作中',
      completed: '已完成',
      cancelled: '已取消'
    }
    return map[status] || status
  },

  // 去详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    })
  },

  // 支付订单
  async payOrder(e) {
    const id = e.currentTarget.dataset.id
    
    try {
      const paymentData = await app.request({
        url: '/payment/create',
        method: 'POST',
        data: { order_id: id }
      })

      wx.requestPayment({
        ...paymentData,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' })
          this.loadOrders()
        },
        fail: () => {
          wx.showToast({ title: '支付已取消', icon: 'none' })
        }
      })
    } catch (error) {
      console.error(error)
    }
  },

  // 取消订单
  cancelOrder(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await app.request({
              url: `/orders/${id}/cancel`,
              method: 'POST'
            })
            wx.showToast({ title: '订单已取消', icon: 'success' })
            this.loadOrders()
          } catch (error) {
            console.error(error)
          }
        }
      }
    })
  },

  // 阻止冒泡
  stopPropagation() {}
})

