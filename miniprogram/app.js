App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:3001/api'
  },

  onLaunch() {
    // 获取本地存储的token
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  },

  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 开发环境：如果获取code失败，使用测试code
          const code = res.code || 'test_code'

          if (code) {
            // 发送 code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: `${this.globalData.baseUrl}/auth/login`,
              method: 'POST',
              data: {
                code: code,
                userInfo: {
                  nickName: '测试用户',
                  avatarUrl: ''
                }
              },
              success: response => {
                if (response.data.success) {
                  this.globalData.token = response.data.data.token
                  this.globalData.userInfo = response.data.data.user
                  wx.setStorageSync('token', response.data.data.token)
                  wx.setStorageSync('userInfo', response.data.data.user)
                  resolve(response.data.data)
                } else {
                  wx.showToast({
                    title: response.data.message || '登录失败',
                    icon: 'none'
                  })
                  reject(response.data.message)
                }
              },
              fail: err => {
                console.error('登录请求失败:', err)
                wx.showToast({
                  title: '登录失败，请检查网络',
                  icon: 'none'
                })
                reject(err)
              }
            })
          } else {
            reject('获取登录凭证失败')
          }
        },
        fail: err => {
          console.error('wx.login失败:', err)
          // 开发环境降级：直接使用测试code
          wx.request({
            url: `${this.globalData.baseUrl}/auth/login`,
            method: 'POST',
            data: {
              code: 'test_code',
              userInfo: {
                nickName: '测试用户',
                avatarUrl: ''
              }
            },
            success: response => {
              if (response.data.success) {
                this.globalData.token = response.data.data.token
                this.globalData.userInfo = response.data.data.user
                wx.setStorageSync('token', response.data.data.token)
                wx.setStorageSync('userInfo', response.data.data.user)
                resolve(response.data.data)
              } else {
                reject(response.data.message)
              }
            },
            fail: reject
          })
        }
      })
    })
  },

  // 请求封装
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.globalData.token}`
        },
        success: res => {
          if (res.data.success) {
            resolve(res.data.data)
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data.message)
          }
        },
        fail: err => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  }
})

