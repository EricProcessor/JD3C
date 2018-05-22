// pages/device/device.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fcs:false,
    "text":"none",
    "change":"block",
    "flag":false,
  },
  device_detail:function(){
    wx.navigateTo({
      url: '../../pages/device/device_detail/device_detail',
    })
  },  
  /**
   * 点击搜索按钮，搜索按钮消失，搜索栏出现，覆盖层出现
   * */
   
  change:function(e){
    if(this.data.text=="block"){
     this.setData({text:"none"})
     
      console.log("none");
    }else{
      this.setData({text:"inline",change:"none",flag:true,fcs:true});
      console.log("block");
      
    }
  },
  /*使用catchtouchmove方法来阻止穿透滑动问题*/
  scrolly: function () {
    console.log("scroll")
  },
  /**
   * 点击覆盖层，覆盖层消失，搜索框消失，搜索按钮出现
   */

  show:function(){
    this.setData({text:"none",change:"block",flag:false})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
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