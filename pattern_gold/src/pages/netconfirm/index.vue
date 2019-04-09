<template>
  <div class="page">
   <div class="bg"></div>
   <div class="pos-box">
      <div>
        <p class="edu-name">{{orderInfo.orderDesc || ""}}</p>
        <p class="edu-desc">{{orderInfo.eduName && `商户： ${orderInfo.eduName}` || ""}}</p>
      </div>
      <div class="card">
        <div class="card-tab">
          <span class="card-tab-item" :class="[activeid == 0 ? 'actived' :'']">信用卡分期</span>
        </div>
        <div class="card-item">
          <div class="card-item-top">
            <p>课程金额（元）</p>
            <h3>{{(orderInfo && orderInfo.orderAmt && $utils.moneyFix(orderInfo.orderAmt)) || 0.00}}</h3>
          </div>
          <div class="card-item-center">
            <div class="card-center-item">
              <p>期数</p>
              <p>{{(orderInfo && orderInfo.periods) || 0}}期</p>
            </div>
            <div class="card-center-item">
              <p>利率</p>
              <p>{{0}}/月</p>
            </div>
          </div>
          <div class="card-item-bottom">
            <div class="list-item">
              <span>总分期金额</span>
              <span class="ftorange">{{(orderInfo && orderInfo.orderAmt &&  $utils.moneyFix(orderInfo.orderAmt)) || 0}}元</span>
            </div>
            <div class="list-item">
              <span>每期还款</span>
              <span class="ftorange">{{(orderInfo && orderInfo.perPayAmt)}}元</span>
            </div>
            <div class="list-item">
              <span>还款时间</span>
              <span>{{(orderInfo && orderInfo.payTime) || '以信用卡还款日为准'}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="button button-self" @click="confirm">确认</div>
    </div>
  </div>
</template>


<script>
import {USER_TOKEN, USER_SIGN} from '@/utils'
import Cache from '@/utils/cache'
export default {
  data () {
    return {
      sign: '',
      token: '',
      orderNo: '',
      activeid: 0,
      orderInfo: {}
    }
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.orderNo = this.$route.params.orderNo
    this.getOrderInfo()
  },

  methods: {
    confirm () {
      if (this.orderInfo && !this.orderInfo.orderAmt) {
        return
      }
      let param = {
        url: '/edu/online/order_confirm',
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: false,
        vm: this,
        params: {
          orderNo: this.orderNo
        }
      };
      this.$utils.http(param)
        .then(res => {
          if (res.head && res.head.code === '8000') {
            let _this = this;
            let login = this.$createLogin({
              onClick (e) {
                _this.loginEvent();
              }
            });
            login.open();
          } else if (res.head && res.head.code == '0000') {
            const url = `/confirm?orderId=${res.body.orderId}`;
            this.$router.push({path: url, query: {timestamp: (new Date()).getTime()}});
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'warn',
              txt: res.head && res.head.msg || '系统异常'
            });
            toast.show();
          }
        })
    },
    getOrderInfo () {
      let param = {
        url: '/edu/online/order_info',
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: false,
        vm: this,
        params: {
          orderNo: this.orderNo
        }
      };
      this.$utils.http(param)
        .then(res => {
          if (res.head && res.head.code === '0000') {
            this.orderInfo = res.body
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'warn',
              txt: res.head && res.head.msg || '系统异常'
            });
            toast.show();
          }
        })
    },
    loginEvent () {
      this.sign = Cache.get(USER_SIGN)
      this.token = Cache.get(USER_TOKEN)
      this.getOrderInfo()
    }
  }

}
</script>

<style scoped>
.page {
  position: relative;
  overflow-x: hidden;
  width: 100vw;
  min-height: 100vh;
}

.bg {
  width: 474px;
  height: 474px;
  border-radius: 50%;
  background: #ffa9b2;
  position: absolute;
  top: -250px;
  left: -40px;
}
.pos-box {
  position: absolute;
  top: 30px;
  left: 25px;
  right: 25px;
}
.edu-name {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  padding-bottom: 5px;
}
.edu-desc {
  font-size: 13px;
  color: #fff;
  padding-bottom: 5px;
}
.card {
  height: 460px;
  background: #fff;
  border-radius: 25px;
  box-shadow: 0 1.5px 2px 0 rgba(0, 0, 0, 0.5);
}
.card-tab {
  height: 69px;
  display: flex;
  border-radius: 25px 25px 0 0;
  overflow: hidden;
}
.card-tab-item {
  flex: 1;
  height: 69px;
  line-height: 69px;
  box-sizing: border-box;
  color: #979797;
  text-align: center;
  font-size: 15px;
  border-bottom: 1px solid #979797;
}
.card-tab-item.actived {
  color: #ff6290;
  border-bottom: 1px solid #ff6290;
}
.card-item {
  display: flex;
  width: 100%;
  height: calc(100% - 69px);
  flex-direction: column;
  justify-content: space-between;
}
.card-item-top {
  margin: 0 auto;
  width: 170px;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #999;
  border-bottom: 1px solid #e1e1e1;
}
.card-item-top h3 {
  line-height: 1;
  margin-top: 20px;
  font-size: 36px;
  color: #1a1a1a;
  padding: 0;
  margin-bottom: 0;
}
.card-item-center {
  display: flex;
  margin: 20px 0;
  height: 62px;
  align-items: center;
}
.card-center-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 20px;
}
.card-center-item:nth-child(1) {
  border-right: 1px solid #e1e1e1;
}
.list-item {
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.5px solid #e1e1e1;
  font-size: 14px;
  color: #1a1a1a;
}
.button-self {
  margin: 20px auto;
}
.ftorange {
  color: #f5a623;
}
</style>


