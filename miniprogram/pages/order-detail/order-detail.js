const app = getApp()

Page({
  data: {
    order: null,
    orderId: null
  },

  onLoad(options) {
    this.setData({ orderId: options.id })
    this.loadOrder()
  },

  // 加载订单详情
  async loadOrder() {
    try {
      wx.showLoading({ title: '加载中...' })
      const order = await app.request({
        url: `/orders/${this.data.orderId}`
      })
      this.setData({ order })
    } catch (error) {
      console.error(error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
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

  // 支付订单
  async payOrder() {
    try {
      const paymentData = await app.request({
        url: '/payment/create',
        method: 'POST',
        data: { order_id: this.data.orderId }
      })

      wx.requestPayment({
        ...paymentData,
        success: () => {
          wx.showToast({ title: '支付成功', icon: 'success' })
          setTimeout(() => {
            this.loadOrder()
          }, 1500)
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
  cancelOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await app.request({
              url: `/orders/${this.data.orderId}/cancel`,
              method: 'POST'
            })
            wx.showToast({ title: '订单已取消', icon: 'success' })
            setTimeout(() => {
              this.loadOrder()
            }, 1500)
          } catch (error) {
            console.error(error)
          }
        }
      }
    })
  }
})

