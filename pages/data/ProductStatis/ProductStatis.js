// pages/data/ProductStatis/ProductStatis.js
var util = require('../../../utils/util.js');
Page({
  /*
 按钮组点击切换
 */
  click_btn: function (e) {
    this.setData({
      _num: e.target.dataset.num
    })
  },


  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,
    year: '',
    month: '',
    day: ''
  
  },
  /*点击切换到上一个月*/
  prevMonth: function () {
    var that = this;
    var preday;
    var preYear = that.data.year;
    var preMonth = that.data.month - 1;
    if (preMonth == 0) {
      preYear = preYear - 1;
      preMonth = 12;
      preday = 31;
      that.setData({
        year: preYear,
        month: preMonth,
        day: preday
      })
    }
    if (preMonth == 2) {
      if (preYear % 4 == 0) {
        preday = 29;
      } else {
        preday = 28;
      }
    } else {
      if (preMonth == 4 || preMonth == 6 || preMonth == 9 || preMonth == 11) {
        preday = 30;
      }
      else {
        preday = 31;
      }
    }
    that.setData({
      day: preday,
      month: preMonth
    })
  },
  /*点击切换到下一个月*/
  nextMonth: function () {
    var that = this;
    var nextday;
    var nextYear = that.data.year;
    that.data.month++;
    var nextMonth = that.data.month;

    if (nextMonth == 13) {
      nextYear = nextYear + 1;
      nextMonth = 1;
      nextday = 31;
      that.setData({
        year: nextYear,
        month: nextMonth,
        day: nextday
      })
    }
    if (nextMonth == 2) {
      if (nextYear % 4 == 0) {
        nextday = 29;
      } else {
        nextday = 28;
      }
    } else {
      if (nextMonth == 4 || nextMonth == 6 || nextMonth == 9 || nextMonth == 11) {
        nextday = 30;
      }
      else {
        nextday = 31;
      }
    }
    that.setData({
      day: nextday,
      month: nextMonth
    })

  },
  /**
   * 生命周期函数--监听页面加载
   * 获取当前的年月日
   */
  onLoad: function (options) {
    var time = util.formatDay2(new Date());
    this.setData({
      time: time
    });
    var year = util.year(new Date());
    var month = util.month(new Date());
    var day = util.day(new Date());
    this.setData({
      year: year,
      month: month,
      day: day
    });
    wx.setNavigationBarTitle({
      title:'商品分析',
    })
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