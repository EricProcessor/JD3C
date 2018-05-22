 
import API from '../../config/api.js';
// pages/data/data.js
var util = require('../../utils/util.js');


Page({
   
  /**
   * 页面的初始数据
   */
  data: {
    sign:'111',
    array:[]
  
  },
setting:function(){
  wx.navigateTo({
   url: '../../pages/data/setting/setting',
 })
},
enterFlowStatis:function(e){
  console.log(e.currentTarget.dataset.key);
   wx.navigateTo({
     url: '../../pages/data/' + e.currentTarget.dataset.key + '/' + e.currentTarget.dataset.key +'',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var time = util.formatTime(new Date());
    var year = util.year(new Date());
    var month = util.month(new Date());
    var day = util.day(new Date());
    this.setData({
      month:month,
      day:day
    });
    var jsondata = { "beginTime": year + "-" + month + "-" + day + " 00:00:00", "endTime": year + "-" + month + "-" + day + " " + time }
    wx.request({
      url: API.dataBoard,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      data: {
        'args': JSON.stringify(jsondata),
        'sign': this.data.sign
      },
      method: 'get',
      success: function (res) {
      
        that.setData({
          array:res.data.data
        })
        console.log(that.data)
      }
    })
    
  
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
  
  }
})