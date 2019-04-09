/* eslint-disable */
import md5 from 'js-md5';
import Fly from 'flyio/dist/npm/fly';
// import store from '../vuex';
let BASE_URL = process.env.NODE_ENV === 'development' ? 'api/hyj-web' : 'http://192.168.31.215:8080/hyj-web';

export default {
  getUrlKey: function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
  },
  // 获取cookie
  getCookie: function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  },
  moneyFix: function (value) {
    value = Number(value).toFixed(2);
    let logNum = value.toString();
    if (logNum.match(/\./g) != null) {
      let integerNum = parseInt(logNum)
        .toString()
        .replace(/\d(?=(\d{3})+$)/g, '$&,');
      let decimalNum = '.' + logNum.replace(/(.*)\.(.*)/g, '$2');
      return integerNum + decimalNum;
    } else {
      return logNum.replace(/\d(?=(\d{3})+$)/g, '$&,');
    }
  },
  jsonSort: function (jsonObj) {
    let arr = [];
    for (var key in jsonObj) {
      arr.push(key)
    }
    arr.sort();
    let str = '';
    for (var i in arr) {
      str += arr[i] + '=' + jsonObj[arr[i]] + '&'
    }
    return str.substr(0, str.length - 1)
  },
  http: async function ({
    url,
    type,
    sign,
    token,
    params,
    vm,
    isLoading,
    isPay
  }) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let fly = new Fly()
      let _toast = null;
      // var _isPaytwo = false;

      // 添加请求拦截器
      fly.interceptors.request.use((request) => {
        // console.log('false'+request.isPay)
        // if (request.isPay) {
        //   _isPaytwo = request.isPay;
        // }
        if (request.isLoading) {
          _toast = request.vm.$createToast({
            txt: '',
            time: 0,
            mask: true
          })
          _toast.show()
        }

        return request;
      })

      // 添加请求拦截器
      fly.interceptors.response.use((response) => {
          // console.log('11'+_isPaytwo)
          // if(!_isPaytwo){
          //   console.log('122'+_isPaytwo)
            _toast ? _toast.hide() : null;
          // }
          return response
        },
        (err) => {
          _toast ? _toast.hide() : null;
          // 发生网络错误后会走到这里
          // return Promise.resolve("ssss")
        })
      let timeStamp = new Date().getTime();
      let json = {
        timeStamp: timeStamp,
        token: token,
        ...params
      };
      let sortJson = _this.jsonSort(json);
      sortJson = `${sortJson}${sign}`;
      fly.request(`${BASE_URL}${url}`, params, {
        method: type,
        parseJson: false,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: token,
          timeStamp: timeStamp,
          sign: md5(sortJson).toUpperCase()
        },
        isLoading: isLoading,
        isPay:isPay,
        vm: vm
      }).then(res => {
        resolve(JSON.parse(res.data))
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export const checkBrowser = () => {
  const browser = {
    versions: function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }
  let obj = {}
  if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
    obj['versions'] = 'ios'
  } else if (browser.versions.android) {
    obj['versions'] = 'android'
  }
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    obj['isWeixin'] = true
  } else {
    obj['isWeixin'] = false
  }
  return obj
}
export const USER_TOKEN = 'USER_TOKEN'
export const USER_SIGN = 'USER_SIGN'
export const ORDERINFO = 'ORDERINFO'
/* eslint-disable */
