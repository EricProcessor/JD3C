import serverAPI from '../../config/server.js';
import util from '../../utils/util.js';
import { Mmd5 } from '../../utils/Mmd5.js'

let app = getApp();
let {
  appid = 269,
  wxversion,
} = app;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    originUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let originUrl = options.h5_url,
      pt_key = wx.getStorageSync('jdlogin_pt_key') || '',
      ts = parseInt(new Date() / 1000),
      h5Data = `appid=${appid}&pt_key=${pt_key}&ts=${ts}dzHdg!ax0g927gYr3zf&dSrvm@t4a+8F`,
      md5H5Data = Mmd5().hex_md5(h5Data),
      data = {
        appid: appid,
        ts: ts,
        sign: md5H5Data,
      };
    this.setData({ originUrl })
    util.wxAjax({
      url: serverAPI.wxapp_gentoken,
      method: 'POST',
      data,
      callback: (res) => {
        let { isSuccess, err_code, url, tokenkey } = res
        if (isSuccess && !err_code) {
          this.setData({
            url: `${url}?to=${originUrl}&tokenkey=${tokenkey}`
          });
        } else {
          this.handleError(res);
        }
      }
    })
  },
  handleError: function (params = {}) {
    let { err_msg = '页面跳转失败，请重试' } = params;
    let { originUrl } = this.data;
    wx.showModal({
      title: '提示',
      content: err_msg,
      success: function (res) {
        if (res.confirm) {
          util.h5Jump(originUrl);
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let { originUrl } = this.data;
    return {
      title: '京东',
      path: `/pages/web-view/web-view?h5_url=${originUrl}`
    }
  }
})