<template>
  <div style="padding-bottom: 20px;">
      <div class="top">
        <div class="left">
          <div class="left-top">
            <div class="icon">{{orderDetail && orderDetail.eduName && orderDetail.eduName.substr(0,1) || ''}}</div>
            <span>总分期金额(元)</span>
          </div>
          <div class="left-bottom">{{(orderDetail && orderDetail.orderAmt && $utils.moneyFix(orderDetail.orderAmt)) || 0}}</div>
        </div>
        <div class="right">
          <img @click="openQrcode" src="static/images/scan_icon_2.png" />
        </div>
      </div>
      <div class="center">
        <div class="center-left">期数<br/>{{orderDetail && orderDetail.periods || 0}}期</div>
        <div class="center-right">每期还款<br/>{{orderDetail && orderDetail.perPayAmt || 0}}元</div>
      </div>
      <div class="line"></div>
      <div v-if="(orderDetail && orderDetail.hasRefund && orderDetail.hasRefund=='Y')" class="refund-box" :class="orderDetail && orderDetail.refundStatus">
        <p style="font-size: 18px;">{{orderDetail && orderDetail.refundStatusDesc}}</p>
        <p v-if="orderDetail && orderDetail.refundStatus!='REFUND_SUCC'" style="margin-top: 10px;">{{orderDetail && orderDetail.inAcctDesc}}</p>
      </div>
      <div class="line"></div>
      <div class="cell">
        <span>还款日</span>
        <span>{{orderDetail && orderDetail.payTime || '以信用卡账单为准'}}</span>
      </div>
      <div class="cell">
        <span>分期方式</span>
        <span>{{orderDetail && orderDetail.payWay || '-'}}</span>
      </div>
      <div class="cell noline">
        <span>分期时间</span>
        <span>{{orderDetail && orderDetail.payTime || '以信用卡账单为准'}}</span>
      </div>
      <div v-if="(orderDetail && orderDetail.hasRefund && orderDetail.hasRefund=='Y')">
        <div class="line"></div>
        <div class="cell">
          <span>退款金额</span>
          <span>{{(orderDetail && orderDetail.refundAmt && `${$utils.moneyFix(orderDetail.refundAmt)}元`) || '-'}}</span>
        </div>
        <div class="cell noline">
          <span>{{`${orderDetail && orderDetail.refundStatus=='REFUND_SUCC'?'退款时间': '申请时间'}`}}</span>
          <span>{{orderDetail && orderDetail.refundTime || '-'}}</span>
        </div>
      </div>
      <div v-if="!(orderDetail && orderDetail.hasRefund && orderDetail.hasRefund=='Y')">
        <div class="button button-self" v-if="status_map[orderDetail.orderStatus] === 'other'" @click="pay">
          <span>去支付</span>
        </div>
        <div
          @click="$router.push(`/myStage?timestamp=${(new Date()).getTime()}`);"
          class="button button-self" v-if="status_map[orderDetail.orderStatus] === 'succ'">
          <span>确认</span>
        </div>
        <div class="button button-self" v-if="status_map[orderDetail.orderStatus] === 'CONFIRM'">
          <span>支付待确认</span>
        </div>
      </div>  
    <QrcodeMask ref="qrcodeMask"/>
  </div>
</template>
<script>
import QrcodeMask from '@/components/qrcodeMask';
import {USER_TOKEN, USER_SIGN} from '@/utils'
import Cache from '@/utils/cache'
export default {
  data () {
    return {
      sign: '',
      token: '',
      orderId: '',
      orderDetail: {},
      status_map: {
        'INIT': 'other',
        'ING': 'other',
        'FAIL': 'other',
        'CLOSE': 'other',
        'CONFIRM': 'blue',
        'SUCC': 'succ'
      }
    }
  },
  components: {
    QrcodeMask
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.orderId = this.$utils.getUrlKey('orderId');
    this.getOrderDetail();
  },
  methods: {
    pay () {
      const url = `/confirm?orderId=${this.orderId}&timestamp=${(new Date()).getTime()}`;
      this.$router.push(url);
    },
    openQrcode () {
      let qrcodeMask = this.$refs.qrcodeMask;
      qrcodeMask.open({ value: this.orderDetail.qrUrl });
    },
    getOrderDetail () {
      let param = {
        url: this.$fetchApi.orderDetail,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params: {
          orderId: this.orderId
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code === '0000') {
            this.orderDetail = res.body;
            // this.$store.dispatch('setOrderInfoAction', res.body);
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
    }
  }
}
</script>

<style scoped>
.refund-box {
  text-align: center;
  background: #efefef;
  padding: 10px 20px;
  font-size: 14px;
}
p {
  padding: 0;
  margin: 0;
}
.REFUND_SUCC {
  color: #46B613;
}
.REFUND_CONFIRM{
  color: #F5A623;
}
.REFUND_FAIL {
  color: #dc2e2e;
}
.top {
  height: 132px;
  background: #fff4f5;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.left {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.left-top .icon {
  width: 20px;
  height: 20px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  background: #dc2e2e;
  border-radius: 50%;
  font-size: 10px;
  margin-right: 10px;
}
.left-top {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #afafaf;
}
.left-bottom {
  font-size: 36px;
  color: #333333;
  line-height: 1;
}
.right {
  width: 20px;
  height: 20px;
}
.right img {
  width: 100%;
}
.center {
  height: 100px;
  background: #fff;
  padding: 18px 0;
  box-sizing: border-box;
  display: table;
}
.center-left,
.center-right {
  display: table-cell;
  vertical-align: middle;
  width: 50vw;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  padding-left: 37px;
}
.center-left {
  border-right: 1px solid #e1e1e1;
}
.line {
  width: 100vw;
  height: 15px;
  background: #efefef;
}

.cell {
  padding: 0 25px;
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #111111;
  position: relative;
}
.cell::after {
  content: "";
  position: absolute;
  left: 25px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #e1e1e1;
}
.cell.noline::after{
  display: none;
}
.cell span:nth-child(2n+1) {
  color: #666666;
}

.button-self {
  margin: 40px auto 0;
}
</style>

