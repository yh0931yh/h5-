<template>
  <div class="page-box">
    <div class="tomy" @click="$router.push({path:'/myStage', query: {timestamp: (new Date()).getTime()}});">
      <img src="static/images/money.png" class="right">
      <div class="left">我的分期</div>
    </div>
    <div class="page">
      <p class="title">欢迎使用花果分期</p>
      <p class="txt">专注于教育分期服务</p>
      <div class="center">
        <img src="static/images/home_1.png" />
        <img src="static/images/home_2.png" />
        <img src="static/images/home_3.png" />
      </div>
      <div class="button button-self" @click="sys_click">
        <img class="icon" src="static/images/scan_icon.png" /> 
        <span>立即申请</span> 
      </div>
      <p class="small-tips">当前支持信用卡</p>
    </div>
  </div>
  <!-- <div @click="$router.push('/fenqi');">11</div> -->
</template>
<script>
import wx from 'weixin-js-sdk';
import {USER_TOKEN, USER_SIGN} from '@/utils'
import Cache from '@/utils/cache'
export default {
  data () {
    return {
      sign: '',
      token: ''
    }
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
  },
  methods: {
    sys_click: function () {
      let param = {
        url: this.$fetchApi.getSignature,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: false,
        vm: this,
        params: {
          reqUrl: window.location.href.replace(window.location.hash, '')
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          let data = res.body
          // alert(JSON.stringify(data))
          wx.config({
            debug: false,
            // 必填，公众号的唯一标识
            appId: data.appid,
            // 必填，生成签名的时间戳
            timestamp: data.timestamp,
            // 必填，生成签名的随机串
            nonceStr: data.noncestr,
            // 必填，签名
            signature: data.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表
            jsApiList: ['checkJsApi', 'scanQRCode']
          });
        })
        .catch(err => {
          console.log(err);
        });

      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
            // alert('1')
          }
        });
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            // alert('扫描结果：'+result);
            window.location.href = result; // 因为我这边是扫描后有个链接，然后跳转到该页面
          }

        });
      });
      wx.error(function (res) {
        console.log(res)
        // alert(JSON.stringify(res))
      })
    }
  }
};
</script>

<style lang="css" scoped>
.page-box {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #6ac7e8;
  display: flex;
  align-items: center;
}
.page {
  width: 100%;
  height: 450px;
  background: #6ac7e8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 35px 15px;
  box-sizing: border-box;
  align-items: center;
}
.title {
  font-size: 24px;
  color: #ffffff;
  line-height: 32px;
}
.txt {
  font-size: 15px;
  color: #ffffff;
  line-height: 32px;
}
.center {
  width: 100%;
  height: 166.5px;
  display: flex;
  justify-content: space-between;
}
.center img {
  width: 101.5px;
  height: 166.5px;
}
.button-self {
  margin-top: 60px;
  width: 198px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 18px;
  line-height: 1;
}
.small-tips {
  font-size: 12px;
  color: #ffffff;
  line-height: 33px;
}
.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
.tomy {
  position: absolute;
  top: 22px;
  left: 15px;
  font-size: 14px;
  color: #111111;
  width: 100px;
  border-radius: 20px;
  height: 32px;
  background: #fff;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}
.tomy .right {
  width: 17px;
  height: 12px;
  margin-right: 4px;
}
</style>


