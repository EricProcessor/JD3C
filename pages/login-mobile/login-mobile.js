import util from '../../utils/util.js';

const DEFAULT_COUNT = 120;
const ERROR_MSG = '服务异常';

Page({
  data: {
    inputVaild: {
      phonecode: false, //手机号是否输入
      msgcode: false, //短信验证码是warn-info否输入
    },
    iconClear: {
      phoneClear: true,
      msgClear: true,
    },
    canLogin: false, //登录是否可点击
    getMsgCode: false, //是否能获取短信验证码
    getMsgCodeText: '获取验证码',
    phoneInput: '', //手机号 init
    msgInput: '', //短信验证码 init
    msgWarn: true, //错误提示
    warnShow: true, //告警toast显示控制
    returnPage: '',
    waitTime: true,
    loginAppId: 269,
    pageType: '',//页面来源类型
    jdlogin: false,
    isLogout: '' //值为1表示由退出登录进入
  },
  onLoad: function (options) {
    let { returnPage = "",
      pageType = "",
      jdlogin = false,
      isLogout = ""
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
        this.getWXSetting();
      }
    })
  },
  getWXSetting() {
    wx.getSetting({
      success: (res) => {
        const AUTH_NAME = 'scope.userInfo'
        let hasAuthorization = res.authSetting[AUTH_NAME];
        if (hasAuthorization) {
          this.getWXUserInfo();
        } else {
          this.wxAuthorize(AUTH_NAME);
        }
      },
      fail: () => {
        this.getWXUserInfo();
      }
    })
  },
  wxAuthorize(scope) {
    wx.authorize({
      scope,
      success: () => {
        this.getWXUserInfo();
      },
      fail: () => {
        this.setWXAuthorization(scope);
      }
    })
  },
  setWXAuthorization(scope) {
    wx.showModal({
      title: '打开设置页面进行授权',
      content: '需要获取您的公开信息（昵称、头像等），请到小程序的设置中打开用户信息授权',
      cancelText: '取消',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              //用户重新同意授权登录
              res.authSetting[scope] && this.getWXUserInfo()
            }
          })
        } else {
          this.getWXUserInfo();
        }
      },
      fail: () => {
        this.getWXUserInfo();
      }
    })
  },
  getWXUserInfo() {
    wx.showLoading({
      title: '加载中',
    })
    wx.getUserInfo({
      success: (wxUserInfo = {}) => {
        this.setData({ wxUserInfo });
      },
      complete: () => {
        this.smsLogin();
      }
    })
  },
  smsLogin() {
    let { wxUserInfo, wxLoginCode, jdlogin } = this.data;
    if (jdlogin){
      wxUserInfo.encryptedData = '';
      wxUserInfo.iv = '';  
      wxLoginCode = ''
    }
    
    util.smslogin({
      code: wxLoginCode,
      wxUserInfo,
      callback: (res) => {
        console.log(res);
         if (res.jd_pin) {
           wx.setStorageSync('jd_pin', res.jd_pin);
         }
        let { isSuccess, err_code, autologin, wx_bind } = res;
        wx.hideLoading();
        if (isSuccess && !err_code) {
          this.setLoginStorage(res);
          if (autologin === 1) {
            util.goBack(this.data)
          } else if (wx_bind) { //1 帐号绑定微信 0 未绑定
            this.handleWXBounded(res);
          }
        }
      }
    })
  },
  setLoginStorage(params = {}) {
    let { guid, lsid, sdk_ver } = params;
    wx.setStorageSync('jdlogin_guid', guid);
    wx.setStorageSync('jdlogin_lsid', lsid);
    wx.setStorageSync('jdlogin_sdk_ver', sdk_ver);
  },
  handleWXBounded(param) {
    let { isLogout, pageType, returnPage } = this.data;
    let { jd_pin, wx_img_url, wx_token } = param;
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
      from: 'mobile',
    })
  },
  changeInput: function (e) {
    var inputJson = this.data.inputVaild;
    var value = e.detail.value;
    var curName = e.target.dataset.name;

    switch (curName) {
      case 'phonecode':
        this.setData({
          phoneInput: value,
        });
        break;
      case 'msgcode':
        this.setData({
          msgInput: value,
        });
        break;
    }

    if (value) {
      inputJson[curName] = true;
      if (curName == 'phonecode') { //手机号
        if (util.checkPhone(value)) {
          this.setData({
            getMsgCode: true
          });
        } else {
          inputJson[curName] = false;
          this.setData({
            getMsgCode: false
          });
        }
      }
    } else {
      inputJson[curName] = false;
      if (curName == 'phonecode') { //手机号
        this.setData({
          getMsgCode: false
        });
      }
    }

    if (util.checkLogin(inputJson)) {
      this.setData({
        canLogin: true
      });
    } else {
      this.setData({
        canLogin: false
      })
    }
  },
  inputFocus: function (e) {
    var iconName = e.target.dataset.name;
    switch (iconName) {
      case 'phonecode':
        this.setData({
          'iconClear.phoneClear': false
        });
        break;
      case 'msgcode':
        this.setData({
          'iconClear.msgClear': false
        });
        break;
    }
  },
  inputBlur: function (e) {
    var iconName = e.target.dataset.name;
    switch (iconName) {
      case 'phonecode':
        this.setData({
          'iconClear.phoneClear': true
        });
        break;
      case 'msgcode':
        this.setData({
          'iconClear.msgClear': true
        });
        break;
    }
  },
  clearPhoneInput: function () { //
    var inputJson = this.data.inputVaild;
    inputJson.phonecode = false;
    this.setData({
      phoneInput: '',
      canLogin: false,
      getMsgCode: false
    });

    return false;
  },
  clearMsgInput: function () { //
    var inputJson = this.data.inputVaild;
    inputJson.msgcode = false;
    this.setData({
      msgInput: '',
      canLogin: false
    });
    return false;
  },
  //获取短信验证码
  obtainCode: function (e) {
    let {getMsgCode, waitTime, phoneInput} = this.data;
    let canSend = getMsgCode && waitTime;
    if(!canSend){
      return
    }
    //重置toast
    this.setData({
      warnShow: true,
      warnText: ''      
    })
    wx.showModal({
      title: ' 提示',
      content: `我们将发送到${phoneInput}`, 
      success:(resModal)=>{
        if(!resModal.confirm){
          return
        }
        let sdk_ver = wx.getStorageSync('jdlogin_sdk_ver'); 
        util.smslogin_sendmsg({
          sdk_ver,
          mobile: phoneInput,
          callback: (res) => {
            let {isSuccess, err_code, err_msg, guid, lsid} = res;
            if(isSuccess && !err_code){
              wx.setStorageSync('jdlogin_guid', guid);
              wx.setStorageSync('jdlogin_lsid', lsid);
              this.setData({
                'inputVaild.imgcode': true,
                imgCodeShow: false,
                getMsgCode: false,
                getMsgCodeText: `${DEFAULT_COUNT}s`,
                waitTime: false
              });
              this.setIntervalTime();              
            }else{
              this.setData({
                warnShow: false,
                warnText: err_msg || ERROR_MSG
              })
            }
          }
        })
      }    
    })
  },
  setIntervalTime(count=DEFAULT_COUNT){
    let timer = setInterval(()=>{
      count--;
      if(count > 0){
        this.setData({
          getMsgCodeText: `${count}s`
        });
      }else{
        clearInterval(timer);
        this.setData({
          'inputVaild.imgcode': false,
          getMsgCode: true,
          getMsgCodeText: '获取验证码',
          waitTime: true
        });
      }
    }, 1000)
  },
  doLogin() {
    let {canLogin, phoneInput, msgInput} = this.data;
    if(!canLogin){
      return
    }
    this.setData({
      warnShow: true,
      warnText: '',
      canLogin: false
    });
    util.dosmslogin({
      mobile: phoneInput,
      smscode: msgInput,
      callback:(res)=>{
        let {isSuccess, err_msg, err_code} = res;
        if(isSuccess && !err_code){
          util.setCommonStorage(res);
          this.handleJumpPage(res);
        }else{
          this.setData({
            warnShow: false,
            warnText: err_msg || ERROR_MSG
          })          
        }
      }
    })
  },
  handleJumpPage(params={}){
    let {need_receiver} = params;
    let {returnPage, phoneInput, pageType} = this.data;
    //有历史收货人，跳转历史收货人页面
    if(need_receiver == 1){
      wx.redirectTo({
        url: `../login-receive/login-receive?mobile=${phoneInput}&returnPage=${returnPage}&pageType=${pageType}`
      })
    }else{
      returnPage && util.goBack(this.data);
    }
  },
  goProtocol: function () {
    wx.navigateTo({
      url: `../protocolTxt/protocolTxt?returnPage=${this.data.returnPage}`,
    })
  }
});
