import util from '../../utils/util.js';

let app = getApp();
let {
  appid = 269,
} = app;

Page({
  onLoad: function (options) {
    let { returnPage = '/pages/protocolTxt/protocolTxt',
      pageType = '',
      jdlogin = false,
      isLogout = ''
    } = options;
    this.getWXLoginCode();
    this.setData({
      returnPage,
      pageType,
      jdlogin,
      isLogout
    })
  },
  getWXLoginCode() {
    wx.login({
      success: (res) => {
        let { code } = res;
        this.setData({ wxLoginCode: code });
      },
      fail: () => {
        console.log('wx.login fail')
      }
    })
  },
  handleGetUserInfo(event = {}) {
    console.log(event.detail)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({ wxUserInfo: event.detail });
    this.smsLogin();
  },
  smsLogin() {
    let _data = this.data;
    let { wxUserInfo, wxLoginCode, returnPage, pageType, jdlogin } = _data;
    util.smslogin({
      code: wxLoginCode,
      wxUserInfo,
      jdlogin,
      callback: (res) => {
        wx.hideLoading();
        let { isSuccess, err_code, jmp_url } = res;
        if (!isSuccess) return
        this.setLoginStorage(res);
        if (res.jd_pin) {
          wx.setStorageSync('jd_pin', res.jd_pin);
        }
               if (!err_code) {
          this.handleNoErrorCode(res);
        } else if (err_code >= 128 && err_code <= 143 && jmp_url) {
          //刚修改过密码，去加验密码页面
          util.setListStorage([{ key: 'jdlogin_returnPage', val: returnPage }, { key: 'jdlogin_pageType', val: pageType }])
          util.h5JumpOnly(`${jmp_url}&appid=${appid}&returnurl=${returnPage}`);
        } else {
          util.toMobilePage(_data);
        }
      }
    })
  },
  setLoginStorage(res = {}) {
    let { guid, lsid, sdk_ver } = res;
    util.setListStorage([{ key: 'jdlogin_guid', val: guid }, { key: 'jdlogin_lsid', val: lsid }, { key: 'jdlogin_sdk_ver', val: sdk_ver }])
  },
  handleNoErrorCode(res) {
    let { autologin, wx_bind } = res;
    let _data = this.data;
    //自动登录
    if (autologin === 1) {
      util.goBack(_data)
      return
    }
    //京东未绑定微信
    if (wx_bind !== 1) {
      util.toMobilePage(_data);
    } else {
      this.handleWXBounded(res)
    }
  },
  //绑定了微信
  handleWXBounded(res) {
    let { isLogout, pageType, returnPage } = this.data;
    let { jd_pin, wx_img_url, wx_token } = res;
    //退出后重新登录 去联合登录页面
    if (isLogout == 1) {
      wx.redirectTo({
        url: `../accountBind/accountBind?nickname=${jd_pin}&pageType=${pageType}&returnPage=${returnPage}&url=${encodeURIComponent(wx_img_url)}&token=${wx_token}`
      })
    } else {
      this.doSure(wx_token);
    }
  },
  doSure(wx_token) {
    let _data = this.data;
    util.doSure({
      wx_token,
      _data,
      from: 'index',
    })
  },
})