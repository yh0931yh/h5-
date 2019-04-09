<template>
  <div class="mask"
    v-if="maskshow"
    @click="close">
    <div class="mask-wrapper">
      <div class="mask-body"
        @click.stop>
        <div class="tips">输入验证码</div>
        <div class="small-tips">验证码已发送至您的预留银行手机号{{mobileNo}}</div>
        <div class="mask-input-box">
          <input class="mask-input"
            type="number"
            @keyup="handleFilterLetters"
                 oninput="if(value.length > 6)value=value.slice(0,6)"
            v-model='verifyCode'
            placeholder="输入您的验证码" maxlength="6" />
          <p ref="code"
            class="mask-smscode"
            :style="{color: disabled ? '#ddd' :'#46a9ff'}"
            @click="getSmscode">{{smscodemsg}}</p>
        </div>
        <div class="button button-self"
          :class="confirmDisable ? 'disabled' : ''"
          @click="confirm">确认分期</div>
        <p class="blue-tips"
          @click="close">取消</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      maskshow: false,
      disabled: false, // 倒計時是否開始
      time: 60, // 验证码倒计时间
      smscodemsg: '获取验证码',
      verifyCode: '',
      timer: '',
      againCode:false,
    };
  },
    watch: {
     regainCode: {
      handler: function (val) {
        this.againCode = val;
          console.log('watch', val) // don't work
        },
        deep: true
      }
    },
  props: {
    sign: {
      type: String,
      default: ''
    },
    token: {
      type: String,
      default: ''
    },
    mobileNo: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    verifDisabled: {
      type: Boolean,
      default: false
    },
    confirmDisable: {
      type: Boolean,
      default: false
    },
    sendCodeParams: {
      type: Object,
      default: ()=>{}
    },
    regainCode: {
      type: Boolean,
      default: false
    },
    isStepTwoPay:{
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.disabled = this.verifDisabled;
    this.againCode = this.regainCode;
  },
  methods: {
    open (opt) {
      this.maskshow = true;
      this.verifyCode = '';
    },
    close () {
      this.maskshow = false;
      this.time = 60;
      this.disabled = false;
      this.smscodemsg = '获取验证码';
      this.verifyCode = '';
      clearTimeout(this.timer)
    },
    handleFilterLetters (e) {
      let value = e.target.value;
      this.verifyCode = value.substr(0, 6)
    },
    confirm () {
      if (!this.verifyCode) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入验证码'
        });
        toast.show();
        return;
      }
      console.log('点击了'+this.againCode)
      this.$emit('confirm', this.verifyCode,this.againCode)
    },
    getSmscode () {
      if (!this.disabled){
        let orderId = this.orderId;
        let params = {}
        if (this.sendCodeParams) {
          params = {
            ...this.sendCodeParams
          }
        }
        params['orderId'] = orderId
        let param = {
          url: this.$fetchApi.paySmsCode,
          type: 'POST',
          sign: this.sign,
          token: this.token,
          params: params
        };
        this.$utils
          .http(param)
          .then(res => {
            if (res.head.code === '0000') {
              this.againCode = true;
              const toast = this.$createToast({
                time: 1500,
                type: 'correct',
                txt: res.head.msg
              });
              toast.show();
              this.settime();
            } else if (res.head.code === '1000' && res.body['needSupply'] == 'Y') {
              this.$createDialog({
                type: 'confirm',
                icon: null,
                title: null,
                content: '为保障您的资金安全， 请先确认信用卡信息，确认无误即可分期',
                confirmBtn: {
                  text: '好的',
                  active: true,
                  disabled: false,
                  href: 'javascript:;'
                },
                cancelBtn: {
                  text: '取消',
                  active: false,
                  disabled: false,
                  href: 'javascript:;'
                },
                onConfirm: () => {
                  this.$emit('sendCode', res)
                },
                onCancel: () => {
                  this.close()
                }
              }).show()
            }else if (res.head.code === '1001') {
              console.log('已过期');
//          此交易已过期，请重新发起
              this.$createDialog({
                type: 'alter',
                icon: null,
                title: null,
                content: '此交易已过期，请重新发起',
                confirmBtn: {
                  text: '重新分期',
                  active: true,
                  disabled: false,
                  href: 'javascript:;'
                },
                onConfirm: () => {
                  if(this.isStepTwoPay){
                    this.$emit('goBack');
                  }
                  else {
                    this.close();
                  }
                }
              }).show()
            }
            else {
              const toast = this.$createToast({
                time: 2500,
                type: 'error',
                txt: res.head.msg
              });
              toast.show();
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    settime () {
      if (this.time === 0) {
        this.disabled = false;
        this.smscodemsg = '获取验证码';
        this.time = 60;
        clearTimeout(this.timer);
        return;
      } else {
        this.disabled = true;
        this.smscodemsg = `${this.time} 秒`;
        this.time = this.time - 1;
      }
      let _this = this;
      this.timer = setTimeout(function () {
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
  z-index: 6;
  background: rgba(0, 0, 0, 0.4);
}
.mask-wrapper {
  position: relative;
}
.mask-body {
  position: absolute;
  top: 100px;
  left: 25px;
  right: 25px;
  height: 300px;
  background: #fff;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 25px 40px;
  box-sizing: border-box;
  align-items: center;
}
.tips {
  font-size: 20px;
  color: #333333;
  line-height: 30px;
  text-align: center;
}
.small-tips {
  font-size: 14px;
  color: #4a4a4a;
  line-height: 30px;
  text-align: center;
}
.blue-tips {
  font-size: 14px;
  color: #46a9ff;
  line-height: 30px;
  text-align: center;
}
.mask-input-box {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cccccc;
  width: 100%;
  justify-content: space-between;
}
.mask-input {
  height: 100%;
  font-size: 14px;
  color: #1a1a1a;
  border: none;
  outline: none;
  box-sizing: border-box;
  width: 120px;
}

.mask-smscode {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  color: #46a9ff;
  width: 80px;
  flex-shrink: 0;
  flex-grow: 0;
  text-align: right;
}
.button-self {
  /* margin-top: 30px; */
  margin: 30px auto 0;
  width: 100%;
}
.button-self.disabled {
  background: #cccccc;
}
</style>


