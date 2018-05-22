// pages/data/CustomerStatis/CustomerStatis.js
import * as echarts from '../../../ec-canvas/echarts';
import API from '../../../config/api.js';
var util = require('../../../utils/util.js');
 
var barChart;
var line1;
var line2;

var startTime;
var endTime;
 var day;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec_bar:{
      onInit: function (canvas, width, height) {
        barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
 
          return barChart;
       }
    },
    ec_line1:{
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
    year: '',
    month: '',
    day: '',
    _num: "1",
    a:"1",
    sign: '123',
    array:[],
  },
  /*点击按钮切换*/
  click_btn: function (e) {
    this.setData({
      _num: e.target.dataset.num,
    });
  },
  /*点击切换到上一个月*/
  prevMonth: function () {
    var that = this;
    var preday;
    var preYear = that.data.year;
    var preMonth = that.data.month ;
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
   
    getChartData(startTime,endTime);
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
    if (nextmonth==13){
      nextmonth=1;
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
  onShow:function(){
    
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line1');
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
      url: API.CustomerStatis,
      data: {
        args: JSON.stringify(jsondata),
        sign: this.data.sign
      },
      method: "get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
      },
      success: function (res) {
        that.setData({
          array: res.data.data.tables,
          charts1_name: res.data.data.charts.ageDistribution.dataName,
          charts1_value: res.data.data.charts.ageDistribution.dataValue,

        })
        getChartData(startTime, endTime);
      }
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
    var starTime = year+"-"+month+"-1 00:00:00";
    var endTime = year+"-"+month+"-"+day+" "+time;
   
    this.setData({
      year: year,
      month: month,
      day: day
    });
    wx.setNavigationBarTitle({
      title: '顾客分析',
    });
    console.log(typeof(this.data._num))
    console.log(this.data._num)
  },
});
function getChartData(startTime,endTime) { 
  var time = util.formatTime(new Date());
  var jsondata = {
    "beginTime": startTime,
    "endTime": endTime,
  }
 
    wx.request({
    url: API.CustomerStatis,
    data: {
      args: JSON.stringify(jsondata),
      sign:"123"
    },
    method: "get",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      'cookie': 'pt_key=' + wx.getStorageSync("jdlogin_pt_key")
    },
    success: function (res) {
      var ajaxChartData = res;
      console.log(ajaxChartData);
      getbarChartOption(ajaxChartData);
      getline1Option(ajaxChartData);
      getline2Option(ajaxChartData);
    } 
  })
   
  
};
function getbarChartOption(ajaxChartData){
  var chartData1 = {
    color: ['#0000FF', '#FF0000'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['男', '女']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ajaxChartData.data.data.charts.ageDistribution.dataName,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [

      {
        name: '男',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,

          }
        },
        data: ajaxChartData.data.data.charts.ageDistribution.dataValue[0].value,
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '女',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,

          }
        },
        data: ajaxChartData.data.data.charts.ageDistribution.dataValue[1].value,
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  }
  barChart.setOption(chartData1); 
}
function getline1Option(ajaxChartData){
   var line1data={
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
        data: ajaxChartData.data.data.charts.vipAmount.dataName,
     
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
        data: ajaxChartData.data.data.charts.vipAmount.dataValue[0].value,


      },


    ]
  }
  line1.setOption(line1data);
};
function getline2Option(ajaxChartData) {
  var line2data= {
    legend:{},
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ajaxChartData.data.data.charts.customer.dataName
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
        name: ajaxChartData.data.data.charts.customer.dataValue[0].key,
        type: 'line',
        data: ajaxChartData.data.data.charts.customer.dataValue[0].value,
      },
      {
        name: ajaxChartData.data.data.charts.customer.dataValue[1].key,
        type: 'line',
        data: ajaxChartData.data.data.charts.customer.dataValue[1].value,
      }
    ]
  }
  line2.setOption(line2data);
}

 
function getTime(year,month){
  console.log(util.year(new Date()));
  console.log(util.month(new Date()));
  if (util.year(new Date())[0] == year && util.month(new Date())[0] == month){
    startTime = year + '-' + month + '-1 00:00:00' ;
    endTime = year + '-' + month + '-' + new Date().getDate() +" 23:59:59";
    day = new Date().getDate()
  }else{
    startTime = year + '-' + month + '-1 00:00:00';
    endTime = year + '-' + month + '-' + new Date(year, month, 0).getDate() + " 23:59:59";
    console.log("starttime:" + startTime);
    console.log("endTime:" + endTime);
    day = new Date(year, month, 0).getDate()
  }
}