<template>
  <div class='page' :style="{backgroundImage: 'url('+img+')',backgroundSize: '100% 100%'}">
    <div class='txt-box'>
      <p class='title'>欢迎使用花果分期</p>
      <p class='txt'>支持信用卡，12期0息</p>
    </div>
    <div class='input-box'>
      <img class='bg' src='static/images/home_bg.png'/>
      <div class='input-box-container'>
        <p style='font-size: 15px;'>课程金额</p>
        <div class='money-input-box' >
          <span style='font-size: 40px; margin-right: 6px;'>¥</span>
          <input
            type='number'
            class='money-input'
            v-model='orderAmt'
            @input='handleInput'
            @change='handleInput'
            @blur="blur(input)"
            ref="input"
          />
        </div>
        <a class='input-button' @click='goto'>去分期</a>
      </div>
    </div>   
  </div>
</template>

<script>
import {USER_TOKEN, USER_SIGN, ORDERINFO} from '@/utils'
import Cache from '@/utils/cache'
import Img from '@/assets/index_bg.jpg'
export default {
  data () {
    return {
      img: Img,
      storeId: '',
      orderAmt: '',
      sign: '',
      token: ''
    };
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.getEduInfo();
  },
  methods: {
    goto () {
      if (Number(this.orderAmt) <= 0) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入课程金额'
        });
        toast.show();
        return;
      }
      let param = {
        url: this.$fetchApi.orderConfirm,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderAmt: Number(this.orderAmt.replace(/,/g, '')),
          storeId: this.storeId
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code === '8000') {
            let _this = this;
            let login = this.$createLogin({
              onClick (e) {
                _this.loginEvent();
              }
            });
            login.open();
          } else if (res.head.code === '0000') {
            Cache.set(ORDERINFO, res.body)
            // this.$store.dispatch('setOrderInfoAction', res.body);
            this.loginEvent();
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
    loginEvent () {
      this.sign = Cache.get(USER_SIGN)
      this.token = Cache.get(USER_TOKEN)
      let orderAmt = Number(this.orderAmt.replace(/,/g, ''));
      const url = `/confirmPage?orderAmt=${orderAmt}&storeId=${this.storeId}`;
      this.$router.push({path: url, query: {timestamp: (new Date()).getTime()}});
    },
    handleInput (e) {
      /* eslint-disable */
      this.orderAmt = e.target.value.replace(/^[\.]/, '').replace(/[^\d.]/g, '');
      /* eslint-disable */
      if (e.target.value.split('.').length - 1 > 1) {
        e.target.value = this.orderAmt;
      }
      this.orderAmt = e.target.value;
    },    
    getEduInfo () {
      let param = {
        url: this.$fetchApi.eduInfo,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        params: null
      };
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code !== '0000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'warn',
              txt: res.head.msg
            });
            toast.show();
          } else {
            document.title = `花果 | ${res.body.eduName}`;
            this.$store.dispatch('setEduInfoAction', res.body);
            this.storeId = res.body.storeId;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    blur() {
      setTimeout(function(){
        console.log(1)
        document.body.scrollTop = 0;
      },100)
    }
  }
};
</script>

<style scoped>
.page{
  width: 100vw;
  height: 100vh;
  overflow: hidden
}
.txt-box .title {
  padding-top: 35px;
  color: #fff;
  font-size: 24px;
  line-height: 33px;
  text-align: center;
}
.txt-box .txt {
  color: #fff;
  font-size: 15px;
  line-height: 33px;
  text-align: center;
}
.input-box {
  width: 295px;
  height: 295px;
  border-radius: 50%;
  margin: 20px auto;
  position: relative;
}
.input-box .bg {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.input-box-container {
  position: absolute;
  padding: 50px 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}
.money-input-box {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.money-input {
  height: 68px;
  width: 222px;
  border-radius: 7.5px;
  border: 1px solid #dededd;
  background: #fff;
  display: inline-block;
  outline: none;
  box-sizing: border-box;
  font-size: 40px;
  padding: 0 10px;
  font-weight: bold;
  color: #1a1a1a;
}
.input-button {
  cursor:pointer;
  width: 200px;
  height: 40px;
  background: #ff6290;
  border-radius: 25px;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
}
</style>

