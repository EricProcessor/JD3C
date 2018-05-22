// pages/mine/mine.js
//import util from '../../utils/util.js'
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:""
  //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  


    this.setData({

      userName: wx.getStorageSync('jd_pin') ? wx.getStorageSync('jd_pin') : 'jd_' + wx.getStorageSync('jdlogin_guid').substring(0, 10)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  exit: function (event) {
     util.logout(function(){ 
       wx.setStorageSync('jd_pin',"");
       var returnPage = encodeURIComponent('/pages/index/index');
        var pageType = 'switchTab';
        wx.redirectTo({
          url: '/pages/login-index/login-index?isLogout=1&pageType=switchTab&returnPage=' + returnPage
        })
    })
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

  }
})