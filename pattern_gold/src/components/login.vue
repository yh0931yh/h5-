<template>
  <div class="mask" v-if="loginshow">
    <div class="mask-wrapper">
      <a @click="close" :style="{backgroundImage: 'url('+img+')',backgroundSize: '100% 100%'}" class="mask-close"></a>
      <div class="mask-body">
        <div class="mask-top">
          <p>验证手机号</p>
        </div>
        <div class="mask-form">
          <div class="mask-input-box">
            <input
              class="mask-input"
              type="text"
              placeholder-class="phcolor"
              placeholder="输入您的手机号"
              @input="mobileChange"
              @change="mobileChange"
              v-model='mobile'
              @blur="blur"
            />
          </div>
          <div class="mask-input-box">
            <input
              class="mask-input"
              type="text"
              @blur="blur"
              v-model='verifyCode'
              placeholder="输入您的验证码" />
            <a ref="code" class="mask-smscode" :style="{color: disabled ? '#ddd' :'#46a9ff'}" @click="getSmscode">{{smscodemsg}}</a>
          </div>
        </div>
        <a class="mask-button" @click="login">登&nbsp;录</a>
        <div class="mask-check" @click="checkAgre = !checkAgre">
          <img class="mask-check-img" :src="checkAgre ? 'static/images/check.png' : 'static/images/ucheck.png'"/>
          登录即同意<a href="http://huayangjin.cn/hyj/protocols/login_pact.html">《用户注册协议》</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {USER_TOKEN, USER_SIGN} from '@/utils'
import Cache from '@/utils/cache'
import Img from '@/assets/icon_close.png'
export default {
  name: 'login',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      img: Img,
      checkAgre: true,
      loginshow: false, // 是否显示登录框
      disabled: false, // 倒計時是否開始
      time: 60, // 验证码倒计时间
      smscodemsg: '获取验证码',
      mobile: '', // 验证码手机号
      verifyCode: '',
      sign: '',
      token: ''
    };
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
  },
  methods: {
    blur () {
      setTimeout(function () {
        console.log(1)
        document.body.scrollTop = 0;
      }, 100)
    },
    open (opt) {
      this.close();
      this.loginshow = true;
    },
    close () {
      this.loginshow = false;
    },
    mobileChange (el) {
      this.mobile = el.target.value.replace(/\D+/, '').substr(0, 11);
    },
    login (e) {
      let mobile = this.mobile;
      let verifyCode = this.verifyCode;
      let param = {
        url: this.$fetchApi.login,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        params: {
          mobile: mobile,
          verifyCode: verifyCode
        }
      };
      if (!mobile || mobile.length != 11) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入手机号'
        });
        toast.show();
        return;
      }
      if (!verifyCode) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入验证码'
        });
        toast.show();
        return;
      }
      if (!this.checkAgre) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请同意用户注册协议'
        });
        toast.show();
        return;
      }
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code === '0000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
            this.close();
            Cache.set(USER_TOKEN, (res.body && res.body.token) || '')
            Cache.set(USER_SIGN, (res.body && res.body.salt) || '')
            this.$emit('click', e);
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'error',
              txt: res.head.msg
            });
            toast.show();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getSmscode () {
      if (this.disabled) {
        return;
      }
      let mobile = this.mobile;
      if (!mobile || mobile.length != 11) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入手机号'
        });
        toast.show();
        return;
      }
      this.disabled = true;
      let param = {
        url: this.$fetchApi.getSmsCode,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        params: {
          mobile: mobile
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code === '0000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
            this.settime();
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'error',
              txt: res.head.msg
            });
            toast.show();
            this.disabled = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    settime () {
      if (this.time === 0) {
        this.disabled = false;
        this.smscodemsg = '获取验证码';
        this.time = 60;
        return;
      } else {
        this.disabled = true;
        this.smscodemsg = `${this.time} 秒`;
        this.time = this.time - 1;
      }
      let _this = this;
      setTimeout(function () {
        _this.settime();
      }, 1000);
    }
  }
};
</script>

<style scoped>
.mask {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
}
.mask-wrapper {
  position: relative;
}
.mask-close {
  position: absolute;
  width: 35px;
  height: 35px;
  top: 40px;
  right: 25px;
}
.mask-body {
  position: absolute;
  top: 100px;
  left: 25px;
  right: 25px;
  height: 322px;
  background: #fff;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  box-sizing: border-box;
}
.mask-top {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 25px;
}
.small-tips {
  font-size: 14px;
  color: #f5a623;
}

.mask-form {
  border: 1px solid #cccccc;
  width: 100%;
  border-bottom: none;
}
.mask-input-box {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1Px solid #cccccc;
  box-sizing: border-box;
}
.mask-input {
  height: 100%;
  padding-left: 15px;
  width: calc(100% - 80px);
  font-size: 14px;
  color: #1a1a1a;
  border: none;
  outline: none;
  box-sizing: border-box;
}

.mask-smscode {
  padding-right: 15px;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  color: #46a9ff;
  width: 80px;
  flex-shrink: 0;
  flex-grow: 0;
  text-align: right;
}
.mask-button {
  cursor:pointer;
  background: #ff6290;
  border-radius: 25px;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  width: 100%;
  margin-top: 45px;
  font-size: 18px;
}
.mask-check {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size:1 4px;
  color: #9a9a9a;
}
.mask-check a {
  color: #1a1a1a;
}
.mask-check-img {
  width: 17px;
  height: 17px;
  margin-right: 5px;
}
</style>

