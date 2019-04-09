<template>
  <div class="page">
    <div class="wrapper">
      <div class="group">
        <div class="group-label-first"></div>
        <div class="group-wrapper">
          <div class="group-content">
            <mt-field label="卡号"  placeholder="请输入信用卡卡号" :attr="{oninput: 'if(value.length>20)value=value.slice(0,20)'}" v-model="cardNo" type="number"></mt-field>
          </div>
          <div class="group-content">
            <mt-field label="姓名" placeholder="请输入持卡人姓名" v-model="owner"></mt-field>
          </div>
          <!--<div class="line"></div>-->
          <mt-field label="身份证" placeholder="请输入持卡人身份证" v-model="idNo"></mt-field>
        </div>
      </div>
      <div class="group">
        <div class="group-label">请填写信用卡信息</div>
        <div class="group-wrapper">
          <div class="group-content">
            <div class="content-right" @click="showTipsDialog(1)">
              <img src="static/images/pay_tips.png">
            </div>
            <mt-field label="安全码"  placeholder="请输入卡背面末三位" v-model="cvv" type="number" :attr="{ oninput: 'if(value.length>3)value=value.slice(0,3)' }"></mt-field>
          </div>
          <!--<div class="line"></div>-->
          <div class="group-content">
            <div class="content-right" @click="showTipsDialog(2)">
              <img src="static/images/pay_tips.png">
            </div>
            <mt-field label="有效期" placeholder="如09/15,请输入0915" v-model="validDate" type="number" :attr="{ oninput: 'if(value.length>3)value=value.slice(0,4)' }"></mt-field>
          </div>
          <!--<div class="line"></div>-->
          <div class="group-content">
            <div class="content-right" @click="showTipsDialog(3)">
              <img src="static/images/pay_tips.png">
            </div>
            <mt-field label="手机号" placeholder="请输入银行预留手机号" v-model="phoneNo" type="number" :attr="{ oninput: 'if(value.length>3)value=value.slice(0,11)' }"></mt-field>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="group-label"
          style="height: 10px;"></div>
        <div class="group-wrapper">
          <div class="group-item">
            <div class="group-left">验证码</div>
            <div class="group-center">
              <input placeholder="手机验证码"
                v-model="verifyCod" maxlength="6">
            </div>
            <div class="group-right">
              <a @click="sendCode"
                :style="{color: disabled ? '#ddd' :'#46a9ff'}">{{smscodemsg}}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="
                button
                button-self"
        @click="confirm">确认</div>
    </div>
    <credit-pay-tips-mask ref="creditPayTipsMask"
                          :title="title"
                          :message="message"
                          :imageName="imageName"></credit-pay-tips-mask>
  </div>
</template>

<script>
  import './style.css'
  import SmsCodeMask from '@/components/smscodeMask';
  import CreditPayTipsMask from '@/components/creditPayTipsMask';
  import {
    USER_TOKEN,
    USER_SIGN
  } from '@/utils'
  import Cache from '@/utils/cache'

  export default {
  components: {
    SmsCodeMask,
    CreditPayTipsMask
  },
  data () {
    return {
      disabled: false, // 倒計時是否開始
      time: 60, // 验证码倒计时间
      smscodemsg: '获取验证码',
      verifyCod: '',
      cardNo: '',
      bankName: '',
      orderId: '',
      bankId: '',
      sign: '',
      token: '',
      step: 0,
      owner: '',
      idNo: '',
      phoneNo: '',
      cvv: '',
      validDate: '',
      confirmDisable: false,
      sendCodeParams: {}, // 发送验证码参数
      isSmsCode: false,
      title:'',
      message:'',
      imageName:'',
      regainCode:false
    }
  },
  mounted () {
    const bankInfo = Cache.get('BANKINFO') && JSON.parse(Cache.get('BANKINFO'))
    this.orderId = bankInfo.orderId || null
    this.bankId = (bankInfo.bankInfo && bankInfo.bankInfo.id) || null
    this.cardNo = (bankInfo.cardNo) || null
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    if (!this.cardNo) {
      this.isSmsCode = true
      this.getBindCardDetail(this.bankId)
    }
  },
  methods: {
    strFormat (e) {
      let val = e.target.value.replace(/[^\d]/g, '').substr(0, 20).replace(/(\d{4})(?=\d)/g, '$1 ');
      this.cardNo = val;
    },
    getBindCardDetail (id) {
      let param = {
        url: this.$fetchApi.bindCardDetail,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          userBindBankId: id
        }
      };
      this.$utils.http(param).then(res => {
        if (res.head.code == '0000') {
          const data = res.body
          this.cardNo = data.cardNo;
          this.cvv = data.cvv;
          this.idNo = data.idNo;
          this.owner = data.owner;
          this.phoneNo = data.phoneNo;
          this.validDate = data.validDate;
        } else {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: res.head.msg
          });
          toast.show();
        }
      })
    },
    goBack () {
      this.$router.back(-1)
    },
    checkVal () {
      const cardNoReg = /^\d{16}$/
      const ownerReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
      const idNoReg = /^(\d{14}|\d{17})(\d|[xX])$/
      const phoneNoReg = /^0*1\d{10}$/
      const cvvReg = /^\d{3}$/
      const validDateReg = /^\d{4}$/

      if (this.cardNo.length > 0 && this.cardNo != '') {
        if (!cardNoReg.test(this.cardNo)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'warn',
            txt: '信用卡卡号为16位，请重新输入'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '信用卡卡号不能为空'
        });
        toast.show();
        return false
      }

      if (this.owner.length > 0 && this.owner != ''){
        if (!ownerReg.test(this.owner)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: '姓名格式不对,请重新输入'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '姓名不能为空'
        });
        toast.show();
        return false
      }

      if (this.idNo.length > 0 && this.idNo != '') {
        if (!idNoReg.test(this.idNo)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: '身份证号为15或18位'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '身份证号不能为空'
        });
        toast.show();
        return false
      }

      if (this.cvv.length > 0 && this.cvv != '') {
        if (!cvvReg.test(this.cvv)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: '安全码为3位数字，请重新输入'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '安全码不能为空'
        });
        toast.show();
        return false
      }

      if (this.validDate.length > 0 && this.validDate != '') {
        if (!validDateReg.test(this.validDate)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: '有效期格式不对,例：0918'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '有效期不能为空'
        });
        toast.show();
        return false
      }

      if (this.phoneNo.length > 0 && this.phoneNo != '') {
        if (!phoneNoReg.test(this.phoneNo)) {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: '手机号为11位数字，请重新输入'
          });
          toast.show();
          return false
        }
      }else {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '手机号不能为空'
        });
        toast.show();
        return false
      }
      return true
    },
    /** pay request */
    confirm () {
      let owner = this.owner
      let idNo = this.idNo
      let phoneNo = this.phoneNo
      let cvv = this.cvv
      let validDate = this.validDate
      if (!this.checkVal()) {
        return
      }
      if (!this.verifyCod) {
        const toast = this.$createToast({
          time: 1500,
          type: 'error',
          txt: '请填写验证码'
        });
        toast.show();
        return false
      }
      if (!this.regainCode) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '验证码已失效，请重新获取'
        });
        toast.show();
        return;
      }
      let param = {
        url: this.$fetchApi.payConfirm,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderId: this.orderId,
          verifyCode: this.verifyCod,
          owner,
          idNo,
          phoneNo,
          cvv,
          validDate,
          userBindBankId: this.bankId
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
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
          } else if (res.head.code === '1000' || res.head.code === '9000') {
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
          } else if (res.head.code === '2000') {
            this.regainCode = false;
            // 验证码错误
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
          }
          else if (res.head.code === '3000'){
            // 请先发送验证码
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
          }
          else if (res.head.code == '4000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
            if (res.body.needSupply && res.body.needSupply == 'Y') {
            } else {
              const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
              this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
            }
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
    sendCode () {
      let owner = this.owner
      let idNo = this.idNo
      let phoneNo = this.phoneNo
      let cvv = this.cvv
      let validDate = this.validDate
      if (!this.checkVal()) {
        return
      }
      const params = {
        url: this.$fetchApi.paySmsCode,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderId: this.orderId,
          owner,
          idNo,
          phoneNo,
          cvv,
          validDate,
          userBindBankId: this.bankId
        }
      }
      this.$utils.http(params).then(res => {
        if (res.head.code === '0000') {
          const toast = this.$createToast({
            time: 1500,
            type: 'correct',
            txt: res.head.msg
          });
          toast.show();
          this.disabled = false;
          this.regainCode = true;
          this.settime();
        } else if (res.head.code === '1000' && res.body['needSupply'] == 'Y') {
          const toast = this.$createToast({
            time: 1500,
            type: 'correct',
            txt: res.head.msg
          });
          toast.show();
          this.disabled = false;
        } else if (res.head.code === '1001') {
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
              this.goBack();
            }
          }).show()
        }
        else {
          const toast = this.$createToast({
            time: 1500,
            type: 'error',
            txt: res.head.msg
          });
          toast.show();
          this.disabled = false;
        }
      })
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
    },
    showTipsDialog(idx) {
      if (idx == 1) {
        this.title='安全码说明';
        this.imageName='static/images/credit_card_1.png';
        this.message='安全码是信用卡交易时的一个安全代码。它通常是印刷在信用卡背面签名处后，是斜体字的最后3位数字。';
      }
      else if(idx == 2){
        this.title='有效期说明';
        this.imageName='static/images/credit_card_2.png';
        this.message='信用卡上印有效期，通常格式为:月/年，例如12/20。一般表示这张信用卡的有效期是到2020年12月。';
      }
      else {
        this.title='手机号说明';
        this.imageName='static/images/credit_card_3.png';
        this.message='银行预留的手机号是办理银行卡时所填写的手机号码。 没有预留，手机号忘记或者已停用，请联系银行客服更新处理。';
      }
      this.$refs.creditPayTipsMask.open();
    }
  }
}
</script>
<style scoped>
.page {
  padding: 0;
}
</style>
