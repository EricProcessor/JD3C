//app.js
App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(1);
    // 登录
    wx.login({
      success: function (res) {
       
        /*
      
        if (res.code) {
          var encodeURIURL = encodeURIComponent('/pages/index/index');
          var appid = 'wx58121b2adf5b4564';
          var secret = '666848b8d8533f586a90219d1654282f';
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res.data);
              
            }
          })







        } else {
          console.log('登录失败！' + res.errMsg)
        }
    */
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})