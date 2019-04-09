<template>
  <div>
    <div class="card">
      <p class="card-font">{{bankName}}</p>
    </div>
    <div class="input">
      <input
        v-model="cardNo"
        @keyup="strFormat($event)"
        type="text"
        placeholder="本人信用卡卡号" />
    </div>
    <div class="button button-self" @click="pay">分期</div>
    <div class="mask" v-show="showMask">
      <div class="mask-body">首次使用信用卡分期服务，为了您的账号安全，即将跳转至银联完成……
      </div>
    </div>
    <sms-code-mask
      ref="smscodeMask"
      :confirmDisable='confirmDisable'
      :sign="sign"
      :token="token"
      @confirm="confirm"
      :orderId="orderId"
    ></sms-code-mask>
    <div id="html"></div>
  </div>
</template>
<script>
import SmsCodeMask from '@/components/smscodeMask';
import {USER_TOKEN, USER_SIGN, ORDERINFO} from '@/utils'
import Cache from '@/utils/cache'
export default {
  data () {
    return {
      cardNo: '',
      showMask: false,
      bankName: '',
      html: '',
      orderId: '',
      confirmDisable: false,
      sign: '',
      token: ''
    };
  },
  components: {
    SmsCodeMask
  },
  methods: {
    goNext () {
      let _this = this;
      this.showMask = true;
      setTimeout(function () {
        _this.showMask = false;
        const url = '/installmentStatus';
        _this.$router.push({path: url, query: {timestamp: (new Date()).getTime()}});
      }, 1000);
    },
    strFormat (e) {
      /* eslint-disable */
      let val = e.target.value.replace(/[^\d]/g,'').substr(0, 20).replace(/(\d{4})(?=\d)/g,"$1 ");
      /* eslint-disable */
      this.cardNo = val;
    },
    pay () {
      if (!this.cardNo) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入信用卡卡号'
        });
        toast.show();
        return;
      }
      let smscodeMask = this.$refs.smscodeMask;
      let param = {
        url: this.$fetchApi.payRequest,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          payChannelId: this.payChannelId,
          orderId: this.orderId,
          bankId: this.bankId,
          cardNo: this.cardNo.replace(/\s*/g, '')
        }
      };
      this.$utils.http(param).then(res => {
        if (res.head.code === '0000') {
          // 需要绑定验证
          if (res.body.needContract == 'Y') {
            document.querySelector('#html').innerHTML = res.body.html;
            document.querySelector('#html form').submit();
            setTimeout(function () {
              document.querySelector('#html').innerHTML = '';
            }, 50);
            // 不需要绑定验证 直接弹输入验证码
          } else {
            smscodeMask.open();
          }
        } else {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: res.head.msg
          });
          toast.show();
        }
      });
    },
    confirm (smscode) {
      if( this.confirmDisable ) return
      this.confirmDisable = true
      let smscodeMask = this.$refs.smscodeMask;
      let param = {
        url: this.$fetchApi.payConfirm,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderId: this.orderId,
          verifyCode: smscode
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          this.confirmDisable = false
          if (res.head.code === '0000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
            smscodeMask.close();
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({path: url, query: {timestamp: (new Date()).getTime()}});
          } else if (res.head.code === '1000') {
            smscodeMask.close();
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({path: url, query: {timestamp: (new Date()).getTime()}});
          } else if (res.head.code === '2000') {
            // 验证码错误
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'error',
              txt: res.head.msg
            });
            toast.show();
            smscodeMask.close();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted () {
    const bankInfo = Cache.get('BANKINFO') && JSON.parse(Cache.get('BANKINFO'))
    const bankInfoDet = bankInfo.bankInfo
    this.orderId = bankInfo.orderId
    this.bankName = bankInfoDet['bankName'];
    this.bankId = bankInfoDet['id'];
    this.orderInfo = Cache.get(ORDERINFO)
    this.payChannelId = this.$utils.getUrlKey('payChannelId');
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
  }
};
</script>
<style scoped>
.card {
  width: 337px;
  height: 162px;
  margin: 30px auto 0;
  background-image: linear-gradient(135deg, #5989f0 0%, #9fd7fb 100%);
  box-shadow: 0 4px 10px 0 #a9d0ff;
  border-radius: 1px;
  padding: 15px 30px;
  box-sizing: border-box;
}
.card-font {
  font-size: 18px;
  color: #ffffff;
}
.input {
  width: 337px;
  height: 40px;
  padding-bottom: 10px;
  margin: 30px auto;
  border-bottom: 1px solid #e1e1e1;
}
.input input {
  border: none;
  width: 100%;
  height: 100%;
  font-size: 20px;
  outline: none;
}
.button-self {
  margin: 30px auto;
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.4);
}
.mask-body {
  width: 230px;
  height: 145px;
  padding: 30px;
  font-size: 14px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 25px;
  box-sizing: border-box;
  margin: 150px auto;
}
</style>

