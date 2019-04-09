<template>
  <div class="page">
    <div class="top">
      <h2>欢迎使用掌上生活APP分期</h2>
      <p class="sub-info">需已安装掌上生活APP</p>
      <p class="logo-info">点击右上方<span class="red">“···”</span> 选择 
        <img class="top-img" v-if="!android" src="static/images/guide_logo.png" />
        <img class="top-img" v-if="!!android" src="static/images/guide_logo_android.png" />
       浏览器打开</p>
    </div>
    <img class="page-center" src="static/images/guide_center.png" />
    <img class="page-1" src="static/images/guide_1.png"/>
    <img class="page-2"  src="static/images/guide_2.png"/>
    <p class="bottom-tips" @click="goBack">返回重选分期方式</p>
  </div>
</template>
<script>
import {checkBrowser} from '@/utils'
export default {
  data () {
    return {
      android: true,
      sign: '',
      token: '',
      orderId: '',
      payChannelId: '',
      payChannelType: ' '
    }
  },
  mounted () {
    /* eslint-disable*/
    let payProtocol = this.$utils.getUrlKey('payProtocol')
    this.sign = this.$utils.getUrlKey('sign')
    this.token = this.$utils.getUrlKey('token')
    this.orderId = this.$utils.getUrlKey('orderId')
    this.payChannelId = this.$utils.getUrlKey('payChannelId')
    this.payChannelType = this.$utils.getUrlKey('payChannelType')
    let browser = checkBrowser()
    this.android = browser.versions == 'android'
    // alert(browser.isWeixin)
    if (!browser.isWeixin) {      
      this.pay()
    }
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    },
    pay () {
       let param = {
        url: this.$fetchApi.outRequest,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderId: this.orderId,
          payChannelId: this.payChannelId,
          payChannelType: this.payChannelType
        }        
      };
      this.$utils.http(param).then(res => {
        // alert(JSON.stringify(res))
         if (res.head.code === '0000') {
            /* eslint-disable*/            
            cmblife.executeProtocol(res.body.payProtocol)
         } else {
           const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: res.head.msg
          });
          toast.show();
         }
      })
    }
  }
};
</script>
<style scoped>
.page  {
  width: 100vw;
  height: 100vh;
  background:rgba(244,246,248,1);
  position: relative;
}
.page-center {
  width: 290px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
.top {
  padding: 30px;
  box-sizing: border-box;
}
.top h2 {
  font-size:20px;
  font-weight:600;
  color:rgba(74,74,74, 1)
}
.top .sub-info {
  padding-top: 8px;
  font-size: 14px;
  font-weight:500;
  color:rgba(246,167,37,1);
  line-height:20px;
}
.top .logo-info {
  font-size:14px;
  padding-top: 8px;
  display: flex;
  align-items: center;
  font-weight:500;
  color:rgba(74,74,74,1);
  line-height:20px;
}
.top .logo-info .red {
  font-size:14px;
  color:rgba(255,98,144,1);
  line-height:20px;
  padding: 0 5px;
}
.top .top-img {
  width: 20px;
  height: 20px;
  margin:0 5px;
}
.page-1 {
  width: 33px;
  position: absolute;
  right: 20px;
  top: 10px;
}
.page-2 {
  width: 106px;
  position: absolute;
  right: 40px;
  top: 45px;
}
.bottom-tips {
  font-size:14px;
  font-weight:400;
  color:rgba(70,169,255,1);
  line-height:20px; 
  position: absolute;
  top: 300px;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  height: 20px;
  text-align: center;
}
</style>
