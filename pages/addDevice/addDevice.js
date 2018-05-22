// pages/addDevice/addDevice.js
import API from '../../config/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:"",
    deviceUuid:"",
    remark:"" ,
    sign:"",
    bangding:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
    var data = wx.getStorageSync('deviceData');
    if (!data.status) {
      that.setData({
        deviceUuid: data.deviceUuid,
        remark: data.remark,
        status: data.status,
        bangding: "1"


      })
      console.log(that.data)
    } else {
      that.setData({

        status: data.status,
        bangding: "2"


      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*
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

            console.log("json:" + JSON.stringify(jsondata));
            console.log("sign:" + that.data.sign);
            if (!res.data.data.status) {
              that.setData({
                deviceUuid: res.data.data.deviceUuid,
                remark: res.data.data.remark,
                status: res.data.data.status,
                bangding: "1"


              })
              console.log(that.data)
            } else {
              that.setData({

                status: res.data.data.status,
                bangding: "2"


              })
            }
          }
        })

      }
    })*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindDevice:function(){
    var jsondata = { "deviceUuid": this.data.deviceUuid, remark: this.data.remark };
    wx.request({
      url:"https://mobile-test.jd.com/api/platform/device/affirm_device_bind.ajax",
      //url: API.addDevice,
      //?args=' + JSON.stringify(jsondata) + '&sign=' + getParams(res.result).sign+'',
      data: {
        'args': JSON.stringify(jsondata),
        'sign': this.data.sign
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      success: function (res) {
        console.log(res);

        if (res.data.data){

          wx.showToast({
            title: '成功绑定',
            icon: 'success',
            success: function (res) {

              setTimeout(function () {
                //要延时执行的代码
                wx.switchTab({
                  url: '../../pages/device/device'
                })
              }, 2000) //延迟时间
            }
          })


          
        }
    
      }
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