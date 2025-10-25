const app = getApp()

Page({
  data: {
    userInfo: {},
    isLogin: false,
    showEditModal: false,
    editForm: {
      nickname: '',
      phone: '',
      address: ''
    }
  },

  onShow() {
    this.loadUserInfo()
  },

  // 加载用户信息
  async loadUserInfo() {
    const token = wx.getStorageSync('token')
    
    if (token) {
      try {
        const userInfo = await app.request({
          url: '/users/me'
        })
        this.setData({
          userInfo,
          isLogin: true
        })
        wx.setStorageSync('userInfo', userInfo)
      } catch (error) {
        console.error(error)
        this.setData({ isLogin: false })
      }
    } else {
      this.setData({ isLogin: false })
    }
  },

  // 登录
  async handleLogin() {
    try {
      wx.showLoading({ title: '登录中...' })
      await app.login()
      this.loadUserInfo()
      wx.showToast({ title: '登录成功', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          app.globalData.token = null
          app.globalData.userInfo = null
          this.setData({
            userInfo: {},
            isLogin: false
          })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  },

  // 去订单页
  goToOrders() {
    wx.switchTab({
      url: '/pages/order/order'
    })
  },

  // 显示编辑个人信息
  showEditProfile() {
    this.setData({
      showEditModal: true,
      editForm: {
        nickname: this.data.userInfo.nickname || '',
        phone: this.data.userInfo.phone || '',
        address: this.data.userInfo.address || ''
      }
    })
  },

  // 隐藏编辑个人信息
  hideEditProfile() {
    this.setData({ showEditModal: false })
  },

  // 输入事件
  onNicknameInput(e) {
    this.setData({ 'editForm.nickname': e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ 'editForm.phone': e.detail.value })
  },

  onAddressInput(e) {
    this.setData({ 'editForm.address': e.detail.value })
  },

  // 保存个人信息
  async saveProfile() {
    try {
      await app.request({
        url: '/users/me',
        method: 'PUT',
        data: this.data.editForm
      })
      wx.showToast({ title: '保存成功', icon: 'success' })
      this.hideEditProfile()
      this.loadUserInfo()
    } catch (error) {
      console.error(error)
    }
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '这是一个餐饮小程序，提供在线点餐、订单管理等功能。',
      showCancel: false
    })
  },

  // 阻止冒泡
  stopPropagation() {}
})

