// pages/data/FlowStatis/FlowStatis.js
var startTime;
var endTime;
var day;
import API from '../../../config/api.js';
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    month: '',
    day: '',
    arr:[],
    array:['按照关注人数排序','按照关注总时长排序'],
    objectArry:[
      {
        id:"followNums",
        name:'按照关注人数排序'
      },
      {
        id: "followtime",
        name: '按照关注总时长排序'
      },
    ],
    index:0,
  },
  /*picker组件的js控制*/
  bindPickerChange: function(e){
    var arry = this.data.arr;
    arry.sort(compare(e.detail.value == 0 ? "followNums" : "followtime"));
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      arr:arry
    })
    console.log(this.data.arr);
   
  },
  
  /*点击切换到上一个月*/
  prevMonth: function () {
    var that = this;
    var preday;
    var preYear = that.data.year;
    var preMonth = that.data.month;
    preMonth--;
    if (preMonth == 0) {
      preYear = preYear - 1;
      preMonth = 12;
    }


    getTime(preYear, preMonth);
    that.setData({
      year: preYear,
      month: preMonth,
      day: day
    });

    this.getChartData(startTime, endTime);
  },
  /*点击切换到下一个月*/
  nextMonth: function () {
    var that = this;

    var nextYear = that.data.year;
    var nextmonth = that.data.month;
    if (nextYear === util.year(new Date())[0] && nextmonth === util.month(new Date())[0]) {
      wx.showModal({
        title: '错误',
        content: '当前没有下一个月数据',
        confirmText: '确定',
        showCancel: false
      })
      return false;
    }
    nextmonth++;
    
    if (nextmonth === 13) {
      nextmonth = 1;
      nextYear++;
    }
    getTime(nextYear, nextmonth);
    this.setData({
      year: nextYear,
      month: nextmonth,
      day: day
    });
   

    this.getChartData(startTime, endTime);
  },
  getChartData: function(startTime, endTime) { 
    var that = this;
    var time = util.formatTime(new Date());
    var jsondata = {
      "beginTime": startTime,
      "endTime": endTime,
    }
 
    wx.request({
      url: API.hot_zone,
      data: {
        args: JSON.stringify(jsondata),
        sign: "123"
      },
      method: "get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      success: function (res) {
        var ajaxChartData = res;

        var arry = ajaxChartData.data.data;
        arry.sort(compare(that.data.index == 0 ? "followNums" : "followtime"));
        
        


        that.setData({
          arr: arry
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取当前的年月日
   */
  onLoad: function (options) {
    var time = util.formatDay2(new Date());
    var year = util.year(new Date());
    var month = util.month(new Date());
    var day = util.day(new Date());
    var starTime = year + "-" + month + "-1 00:00:00";
    var endTime = year + "-" + month + "-" + day + " " + time;

    this.setData({
      year: year,
      month: month,
      day: day
    });


    wx.setNavigationBarTitle({
      title: '热区分析',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this

    var year = util.year(new Date())[0];
    var month = util.month(new Date())[0];

    getTime(year, month);
    this.setData({
      year: year,
      month: month,
      day: day
    });
    this.getChartData(startTime, endTime);
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
function getTime(year, month) {
  if (util.year(new Date())[0] == year && util.month(new Date())[0] == month) {
    startTime = year + '-' + month + '-1 00:00:00';
    endTime = year + '-' + month + '-' + new Date().getDate() + " 23:59:59";
    day = new Date().getDate()
  } else {
    startTime = year + '-' + month + '-1 00:00:00';
    endTime = year + '-' + month + '-' + new Date(year, month, 0).getDate() + " 23:59:59";
    day = new Date(year, month, 0).getDate()
  }
}

var compare = function (prop) {
  return function (obj1, obj2) {
    var val1 = parseInt(obj1[prop]);
    var val2 = parseInt(obj2[prop]); 
     
    return val1 - val2;
  }
}