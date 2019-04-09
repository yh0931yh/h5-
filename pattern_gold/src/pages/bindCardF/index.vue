<template>
  <div class="page">
    <div class="header">
      <h2>{{bankName}}</h2>
    </div>
    <div class="wrapper">
      <div class="group">
        <div class="group-wrapper">
          <div class="group-item">
            <div class="group-left">卡号</div>
            <div class="group-center">
              <input placeholder="信用卡卡号"
                v-model="cardNo"
                @keyup="strFormat($event)"
                type="text"
                :clearable="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="button button-self"
        @click="next">下一步</div>
    </div>
  </div>
</template>

<script>
import {
  USER_TOKEN,
  USER_SIGN,
  checkBrowser
} from '@/utils'
import Cache from '@/utils/cache'
import './style.css'
export default {
  data () {
    return {
      cardNo: '',
      bankName: '',
      orderId: '',
      bankId: ''
    };
  },
  mounted () {
    const bankInfo = Cache.get('BANKINFO') && JSON.parse(Cache.get('BANKINFO'))
    const bankInfoDet = bankInfo.bankInfo
    this.orderId = bankInfo.orderId
    this.bankName = bankInfoDet['bankName'];
    this.bankId = bankInfoDet['id'];
    this.payChannelId = this.$utils.getUrlKey('payChannelId');
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
  },
  methods: {
    /** cardNo input event */
    strFormat (e) {
      let val = e.target.value.replace(/[^\d]/g, '').substr(0, 20).replace(/(\d{4})(?=\d)/g, '$1 ');
      this.cardNo = val;
    },
    /** cardNo next */
    next () {
      if (!this.cardNo) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请输入信用卡卡号'
        });
        toast.show();
        return;
      }
      const bankInfo = Cache.get('BANKINFO') && JSON.parse(Cache.get('BANKINFO'))
      bankInfo['cardNo'] = this.cardNo.replace(/\s*/g, '')
      Cache.set('BANKINFO', bankInfo)
      const url = `/bindCardFTwoPay`;
      this.$router.push({
        path: url,
        query: {
          payChannelId: this.payChannelId,
          timestamp: (new Date()).getTime()
        }
      });
    }
  }

}
</script>
