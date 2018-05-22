//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    array: ['亦庄京东总部C座', '朝林', '北辰世纪中心A座'],
    ojectArray: [
      {
        id: 0,
        name: '亦庄'
      },
      {
        id: 1,
        name: '朝林'
      },
      {
        id: 2,
        name: '北辰'
      }
    ],
    index: 0,
  },
  addStore: function (event) {
    wx.navigateTo({
      url: '../../pages/addStore/addStore',
    })
  },
  addDevice: function (event) {

    
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        that.setData({
          sign: getParams(res.result).sign
        })
        var jsondata = { "deviceUuid": getParams(res.result).deviceUuid };

        wx.request({
          url: 'https://mobile-test.jd.com/api/platform/device/need_affirm_device_remark.ajax',
          //?args=' + JSON.stringify(jsondata) + '&sign=' + getParams(res.result).sign+'',
          data: {
            'args': JSON.stringify(jsondata),
            'sign': that.data.sign
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
          },
          success: function (res) {
            if (res.data.code == 1) {
              wx.showModal({
                title: '错误',
                content: '扫描的二维码未识别',
                confirmText: '确定',
                showCancel: false
              })
              return false;
            }
            wx.navigateTo({
              url: '../../pages/addDevice/addDevice',
            })
            wx.setStorageSync('deviceData', res.data.data)
          /*  if (!res.data.data.status) {
              that.setData({
                deviceUuid: res.data.data.deviceUuid,
                remark: res.data.data.remark,
                status: res.data.data.status,
                bangding: "1"


              })
            
            } else {
              that.setData({

                status: res.data.data.status,
                bangding: "2"


              })
            }*/
          }
        })

      }
    })

    
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    wx.request({
      url:'http://mobile-test.jd.com/api/xiaochengxu/store/get_user_store.ajax',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      method:'get',
      data:{
        args:{
          "pin":"sadsafdsfdsf"
        },
       sign:222
      },
      success:function(res){
        console.log(res)
      }
    });
    wx.request({
      url:'http://mobile-test.jd.com/api/xiaochengxu/store/store_index.ajax',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      data:{
        args: {"areacode":"10001"},
        sign:123
      },
      method:'get',
      success:function(res){
        console.log(res)
      }
    })
  },
  onLoad: function () {
    console.log(wx.getStorageSync("jdlogin_pt_key"));
   if (!wx.getStorageSync('jdlogin_pt_key') || wx.getStorageSync('jdlogin_pt_key') == "") {
    
      var returnPage = encodeURIComponent('/pages/index/index');
      var pageType = 'switchTab';
      wx.redirectTo({
        url: '/pages/login-index/login-index?pageType=switchTab&returnPage=' + returnPage
      })
      return false;
    } 
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

var getParams = function (url) {
  if (url === undefined || typeof (url) != 'string') {
    return null;
  }
  var items = url.split('&');
  var json = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i].split('=');
    json[item[0]] = item[1];
  }
  return json;
} 