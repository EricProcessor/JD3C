import serverApi from '../config/server.js';
import { Mmd5 } from './Mmd5.js';

let app = getApp();
let {
  appid = 269,
  wxversion ='wx58121b2adf5b4564',
} = app;

const DEFAULT_APPID = 269;

function wxAjax({ url, method = 'GET', data, header, callback }) {
  const CONTENT_TYPE = 'application/x-www-form-urlencoded',
    DEFAULT_HEADER = {
      'content-type': CONTENT_TYPE,
      'cookie': setCookie()
    };
  wx.request({
    url,
    data,
    method,
    header: header || DEFAULT_HEADER,
    complete: (res) => {
      let { statusCode,
        data } = res,
        isSuccess = statusCode >= 200 && statusCode < 300 || statusCode === 304;
      data = data || {}; //兼容null
      data.isSuccess = isSuccess;
      data.wxStatus = isSuccess ? 'success' : 'fail';
      callback(data);
    }
  })
}

function setCookie() {
  const GUID = wx.getStorageSync('jdlogin_guid') || '',
    LSID = wx.getStorageSync('jdlogin_lsid') || '',
    PIN = wx.getStorageSync('jdlogin_pt_pin') || '',
    KEY = wx.getStorageSync('jdlogin_pt_key') || '',
    TOKEN = wx.getStorageSync('jdlogin_pt_token') || '';
  return `guid=${GUID}; lsid=${LSID}; pt_pin=${PIN}; pt_key=${KEY}; pt_token=${TOKEN}`
}

function smslogin({ code, wxUserInfo, callback }) {
  let { iv, encryptedData } = wxUserInfo;
  let data = {
    appid,
    wxversion,
    code,
    user_data: encryptedData,
    user_iv: iv,
  }
  wxAjax({
    url: serverApi.smslogin,
    data,
    method: 'POST',
    callback
  })
}

function smslogin_sendmsg({ sdk_ver, mobile, callback }) {
  const MD5_SALT = 'Abcdg!ax0bd39gYr3zf&dSrvm@t%a3b9';
  let commonStr = `appid=${appid}&mobile=${mobile}`;
  let sign = sdk_ver == 2 ? `${commonStr}&wxappid=${wxversion}${MD5_SALT}` : `${commonStr}${MD5_SALT}`;
  let md5Sign = Mmd5().hex_md5(sign);
  let url = `${serverApi.smslogin_sendmsg}?${commonStr}&sign=${md5Sign}`;
  wxAjax({
    url,
    callback
  })
}

function dosmslogin({ mobile, smscode, callback }) {
  let data = {
    mobile,
    smscode
  }
  wxAjax({
    url: serverApi.dosmslogin,
    data,
    method: 'POST',
    callback,
  })
}

function goBack({ returnPage, pageType }) {
  returnPage = decodeURIComponent(returnPage);
  switch (pageType) {
    case 'switchTab':
      wx.switchTab({
        url: returnPage
      })
      break
    case 'h5':
      h5Jump(returnPage)
      break
    default:
      wx.redirectTo({
        url: returnPage
      });
  }
}

//只做跳转，其他逻辑在web-view中执行
function h5JumpOnly(page) {
  wx.redirectTo({
    url: '../web-view/web-view?h5_url=' + encodeURIComponent(page),
  })
}

function smslogin_checkreceiver({ mobile, receiver, callback }) {
  let data = {
    mobile,
    receiver,
  }
  wxAjax({
    url: serverApi.smslogin_checkreceiver,
    data,
    method: 'POST',
    callback,
  })
}


function wxconfirmlogin({ wx_token, callback }) {
  let data = {
    wx_token,
  }
  wxAjax({
    url: serverApi.wxconfirmlogin,
    data,
    method: 'POST',
    callback,
  })
}

function logout(callbackFun) {
  wxAjax({
    url: `${serverApi.logout}?appid=${appid}`,
    callback: (res = {}) => {
      let { isSuccess } = res;
      if (isSuccess) {
        callbackFun();
      } else {
        console.log('logout request failed')
      }
      ['jdlogin_pt_key', 'jdlogin_pt_pin', 'jdlogin_pt_token'].forEach((item) => { wx.removeStorageSync(item) })
    }
  })
}

//检测是否能登录
function checkLogin(obj) {
  var flag = true;
  for (var key in obj) {
    if (!obj[key]) {
      flag = false;
      return flag;
    }
  }
  return flag;
}

//验证是否为手机号码
function checkPhone(phone) {
  var pattern = /^1[3-9][0-9]{9}$/;
  return pattern.test(phone);
}

function setCommonStorage(params = {}) {
  let { pt_key, pt_token, expire_time, refresh_time, pt_pin } = params;
  let temp = [{
    key:'jdlogin_pt_pin',
    val:pt_pin
  }, {
    key:'jdlogin_pt_key',
    val:pt_key
  }, {
    key:'jdlogin_pt_token',
    val:pt_token
  }, {
    key:'jdlogin_pt_key_expire_time',
    val:expire_time
  },{
    key:'jdlogin_pt_key_refresh_time',
    val:refresh_time
  }]
  setListStorage(temp);
}

function setListStorage(list=[]){
  list.forEach((item={})=>{
    let {key, val} = item;
    val && wx.setStorageSync(key, val);
  })
}

function doSure({wx_token, _data, from}){
  wxconfirmlogin({
    wx_token, 
    callback: (res) => {
      wx.hideLoading();
      let { isSuccess, err_msg, err_code} = res;
      let {returnPage} = _data;
      if(isSuccess && !err_code){
        setConfirmLoginStorage(res);
        returnPage && goBack(_data);
      }else if(from === 'bind'){
        //联合登录页面异常处理特殊逻辑
        wx.showModal({
          content: err_msg,
          showCancel : false,
          success: (res)=> {
            toMobilePage(_data)

          }
        })
      }
    }
  })
}

function toMobilePage(params={}){
  let {returnPage, pageType, jdlogin=1} = params;//jdlogin 1默认强制使用京东账号登录
  wx.redirectTo({
    url: `../login-mobile/login-mobile?jdlogin=${jdlogin}&returnPage=${returnPage}&pageType=${pageType}`
  })
}

function setConfirmLoginStorage(params){
  let {pt_pin, pt_key, pt_token} = params;
  try{
    let temp = [{
      key:'jdlogin_pt_pin',
      val:pt_pin
    }, {
      key:'jdlogin_pt_key',
      val:pt_key
    }, {
      key:'jdlogin_pt_token',
      val:pt_token
    }, {
      key:'login_flag',
      val: true
    }]
    setListStorage(temp);
  }catch(e){
    console.log('fail to set confirmlogin storage')
  }
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}
const formatDay2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const year = date => {
  const year = date.getFullYear()
  return [year]
}
const month = date => {
  const month = date.getMonth() + 1
  return [month]
}
const day = date => {
  const day = date.getDate()
  return [day]
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
module.exports = {
  formatTime: formatTime,
  formatDay2: formatDay2,
  year: year,
  month: month,
  day: day,
  smslogin,
  smslogin_sendmsg,
  dosmslogin,
  goBack,
  smslogin_checkreceiver,
  wxconfirmlogin,
  logout,
  checkPhone,
  checkLogin,
  h5JumpOnly,
  wxAjax,
  setCommonStorage,
  setListStorage,
  doSure,
  toMobilePage,
}
