import util from '../../utils/util.js';

Page({
    data: {
        nickname: '',
        userImgUrl: '',
        returnPage: '',
        pageType: ''//页面来源类型
    },
    onLoad: function (options) {
        let {
            token = null,
            nickname = '',
            url = '',
          //  returnPage = '',
          //  pageType = '',
            returnPage = '',//encodeURIComponent('/pages/index/index'),
             pageType = '',//'switchTab',
        } = options;
        this.setData({
            wx_token: token,
            nickname,
            userImgUrl: decodeURIComponent(url),
            returnPage,
            pageType
        })
    },
    doSure: function () {
        let _data = this.data;
        let { wx_token } = _data;
        util.doSure({ wx_token, _data, from: 'bind' })
    },
    otherWay: function () {
      wx.setStorageSync('jd_pin', "");
        util.toMobilePage(this.data)
    },
})
