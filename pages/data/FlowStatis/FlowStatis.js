// pages/data/FlowStatis/FlowStatis.js
import * as echarts from '../../../ec-canvas/echarts';
import API from '../../../config/api.js';
var util = require('../../../utils/util.js');
var startTime;
var endTime;
var day;
var line1;
var line2;
var line3;

function initChart(that, canvas, width, height, option) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

 // that.chart = chart;
  chart.setOption(option);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec_line1: {
      onInit: function (canvas, width, height) {
        line1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(line1);
        return line1;
      }
    },
    ec_line2: {
      onInit: function (canvas, width, height) {
        line2 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(line2);
        return line2;
      }
    },
    ec_line3: {
      onInit: function (canvas, width, height) {
        line3 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(line3);
        return line3;
      }
    },
    year: '',
    month: '',
    day: '',
    a: "1",
    b: "2",
    c: "3",
    _num: "1",
    sign: '',
    day: '',
    a: "1",
    b: "2",
    c: "3",
    _num: "1",
    array:[]
  },
  /*
  按钮组点击切换
  */


  click_btn: function (e) {
    this.setData({
      _num: e.target.dataset.num
    })
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
    getTime(preYear, preMonth);
    that.setData({
      day: preday,
      month: preMonth
    })
  },
  /*点击切换到下一个月*/
  nextMonth: function () {
    var that = this;

    var nextYear = that.data.year;
    var nextmonth = that.data.month;
    console.log(that.data);

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
    if (nextmonth == 13) {
      nextMonth = 1;
      nextYear++
    }
    getTime(nextYear, nextmonth);
    this.setData({
      year: nextYear,
      month: nextmonth,
      day: day
    });


    getChartData(startTime, endTime);
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取当前的年月日
   */
  onLoad: function (options) {
    console.log(this);
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
      title: '客流分析',
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

    var jsondata = {
      "beginTime": startTime,
      "endTime": endTime,
    }

    wx.request({
      url: API.FlowStatis,
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
        console.log(res.data.data.tables)
        that.setData({
          array: res.data.data.tables
        })
        getChartData(startTime, endTime);
      }
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
});
function getline2Option(ajaxChartData) {
  return {
    legend: {},
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1', '5', '9', '13', '17', '21', '25', '29']
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '新顾客数量',
        type: 'line',
        data: [510, 800, 1500, 1300, 1800, 2100, 0, 0],
      },
      {
        name: '最低气温',
        type: 'line',
        data: [300, 600, 800, 700, 900, 1000, 0, 0],
      }
    ]
  }
};
function getline1Option(ajaxChartData) {
  var line1data = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [ajaxChartData.data.data.charts.FlowStatis.dataValue[0].key]
    },

    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ajaxChartData.data.data.charts.FlowStatis.dataName,

      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '会员人数',
        type: 'line',
        data: ajaxChartData.data.data.charts.FlowStatis.dataValue[0].value,


      },


    ]
  }
  line1.setOption(line1data);
};
function getline3Option(ajaxChartData) {
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['会员人数']
    },

    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['0', '4', '8', '12', '16', '20', '24', '28']
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '会员人数',
        type: 'line',
        data: [500, 600, 1300, 1600, 0, 0, 0, 0],


      },


    ]
  }
};
function getChartData(startTime, endTime) {
  var time = util.formatTime(new Date());
  var jsondata = {
    "beginTime": startTime,
    "endTime": endTime,
  }
  console.log(jsondata)
  wx.request({
    url: API.FlowStatis,
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
      console.log(ajaxChartData);
      getline3Option(ajaxChartData);
      getline1Option(ajaxChartData);
      getline2Option(ajaxChartData);
    }
  })
};
function getTime(year, month) {
  console.log(util.year(new Date()));
  console.log(util.month(new Date()));
  if (util.year(new Date())[0] == year && util.month(new Date())[0] == month) {
    startTime = year + '-' + month + '-1 00:00:00';
    endTime = year + '-' + month + '-' + new Date().getDate() + " 23:59:59";
    day = new Date().getDate()
  } else {
    startTime = year + '-' + month + '-1 00:00:00';
    endTime = year + '-' + month + '-' + new Date(year, month, 0).getDate() + " 23:59:59";
    console.log("starttime:" + startTime);
    console.log("endTime:" + endTime);
    day = new Date(year, month, 0).getDate()
  }
}