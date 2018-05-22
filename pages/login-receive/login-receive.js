import util from '../../utils/util.js';

Page({
  data: {
    iconClear: true,
    canLogin: false, //注册是否可点击
    receive: '', //手机号 init
    warnShow: true, //告警toast显示控制
    warnText: '', //告警 toast TODO
    returnPage: '',
    pageType: '',//页面来源类型
    jdlogin: false,
    isLogout: ''//值为1表示由退出登录进入
  },

  onLoad: function (options = {}) {
    let { mobile='', returnPage='', pageType='', jdlogin=false, isLogout=''} = options;
    this.setData({
      returnPage,
      pageType,
      jdlogin,
      isLogout,
      mobile,
    })
  },

  inputFocus: function () {
    this.setData({ iconClear: false });
  },

  inputBlur: function () {
    this.setData({ iconClear: true });
  },

  changeInput: function (e) {
    var value = e.detail.value;
    this.setData({ receive: value });
    if (value) {
      this.setData({ canLogin: true });
    } else {
      this.setData({ canLogin: false });
    }
  },

  clearInput: function () {
    this.setData({
      canLogin: false,
      receive: ''
    });
  },

  checkReceiver(e) {
    let _data = this.data;
    let { canLogin, mobile, receive, returnPage } = _data;
    if (!canLogin) {
      return
    }
    this.setData({
      warnShow: true,
      warnText: '',
      canLogin: false
    })
    util.smslogin_checkreceiver({
      mobile,
      receiver: receive,
      callback: (res) => {
        let { isSuccess, err_code, err_msg } = res;
        if (isSuccess && !err_code) {
          util.setCommonStorage(res);
          returnPage && util.goBack(_data);
        } else {
          this.setData({
            warnShow: false,
            warnText: err_msg,
          })
        }
      }
    })
  }
});