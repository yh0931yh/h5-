<template>
  <div v-show="!loading">
    <div class="topcard">
      <div class="icon">
        <img src="static/images/status_succ.png"
          v-if="status=='succ'" />
        <img src="static/images/status_fail.png"
          v-if="status!='succ'" />
      </div>
      <div class="tips">
        <span v-if="status">{{statusMsg}}</span>
        <span v-if="!status">{{statusMsg}}</span>
      </div>
      <div class="smalltips"
        v-show="status!='succ'">
        {{orderDetail && orderDetail.failMsg}}
      </div>
      <div class="card-content-box">
        <p class="eduname">{{orderDetail && orderDetail.eduName || ''}}</p>
        <p class="ordedesc">{{orderDetail && orderDetail.orderDesc || ''}}</p>
        <div class="card-content">
          <div class="row">
            <span>总金额（元）</span>
            <span>期数</span>
            <span>每期还款（元）</span>
          </div>
          <div class="row">
            <span>{{orderDetail && orderDetail.orderAmt || 0}}</span>
            <span>{{orderDetail && orderDetail.periods || 0}}期</span>
            <span>{{orderDetail && orderDetail.perPayAmt || 0}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="graytips"
        v-show="status=='succ'">还款详情请留意您的信用卡账单</div>
      <div class="button-box"
        v-show="status == 'succ'">
        <div class="button button-self" v-show="backStatus == true"
          @click="$router.push({path: '/myStage', query: {timestamp: (new Date()).getTime()}});">完成</div>
        <div class="button button-self button-normal" v-show="backStatus == false"
             @click="$router.push({path: '/myStage', query: {timestamp: (new Date()).getTime()}});">完成</div>
        <div v-show="backStatus == false" class="button button-self"
          @click="openQrcode">查看付款码</div>
      </div>
      <div class="button button-self"
        @click="pay"
        v-show="status == 'other'">重新分期</div>
      <div class="button button-self"
        v-show="status == 'loading'"
        @click="$router.push({path: '/myStage', query: {timestamp: (new Date()).getTime()}});">完成</div>
      <div class="button button-self back"
           @click="handleBack"
           v-show="backStatus">返回教育机构</div>
    </div>
    <QrcodeMask ref="qrcodeMask" />
  </div>
</template>
<script>
import QrcodeMask from '@/components/qrcodeMask';
import { USER_TOKEN, USER_SIGN } from '@/utils'
import Cache from '@/utils/cache'
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      status: true,
      tranNo: '',
      loading: true,
      statusMsg: '',
      orderDetail: {},
      time: 0,
      timer: null,
      redirectUrl:'',
      backStatus:false,
      sign: '',
      token: '',
      status_map: {
        'INIT': 'other',
        'ING': 'other',
        'FAIL': 'other',
        'CLOSE': 'other',
        'CONFIRM': 'loading',
        'SUCC': 'succ'
      }
    }
  },
  components: {
    QrcodeMask
  },
  methods: {
    getStatus () {
      let _toast = this.$createToast({
        txt: '',
        time: 0,
        mask: true
      })
      console.log(this.sign)
      console.log(this.token)

      _toast.show()
      let _this = this
      let param = {
        url: this.$fetchApi.getPayConfirm,
        type: 'post',
        sign: this.sign,
        token: this.token,
        isLoading: false,
        vm: this,
        params: {
          tranNo: this.tranNo,
          payChannel: this.payChannel
        }
      };
      this.timer = setTimeout(function () {
        _this.$utils.http(param)
          .then(res => {
            _this.time = 1 + _this.time
            _toast.hide()
            if (_this.time > 3) {
              const toast = _this.$createToast({
                time: 1500,
                type: 'error',
                txt: '订单支付结果待确认，请稍后查看'
              });
              toast.show();
              window.clearTimeout(this.timer);
              _this.status = 'loading';
              _this.statusMsg = '订单支付结果待确认，请稍后查看';
              _this.orderDetail = res.body;
              _this.loading = false;
              return;
            }
            if (res.head.code == '0000') {
              _this.status = _this.status_map[res.body.status];
              _this.statusMsg = res.body.statusMsg;
              _this.orderDetail = res.body;
              _this.loading = false;
              console.log(res.body.redirectUrl);
              if(typeof(res.body.redirectUrl) != "undefined"){
                _this.redirectUrl = res.body.redirectUrl;
                console.log(1);
              }

              console.log('aaaa'+_this.redirectUrl);

              if (typeof(_this.redirectUrl) == "undefined" || _this.redirectUrl == '')
              {
                _this.backStatus=false;
                console.log(2);
              }
              else {
                _this.backStatus=true;
                console.log(3);
              }
            } else if (res.head.code == '9000' || res.head.code == '9999') {
              _this.getStatus()
            } else {
              _this.loading = false;
              const toast = _this.$createToast({
                time: 1500,
                type: 'error',
                txt: res.head.message
              });
              toast.show();
            }
          })
          .catch(err => {
            const toast = _this.$createToast({
              time: 1500,
              type: 'error',
              txt: err.message
            });
            toast.show();
          })
      }, 1000)
    },
    pay () {
      const url = `/confirm?orderId=${this.orderDetail.orderId}&timestamp=${(new Date()).getTime()}`;
      this.$router.push(url);
    },
    openQrcode () {
      let qrcodeMask = this.$refs.qrcodeMask;
      qrcodeMask.open({ value: this.orderDetail.qrUrl });
    },
    handleBack() {
      window.location.href = this.redirectUrl;
    }
//
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.tranNo = this.$utils.getUrlKey('tranNo');
    this.payChannel = this.$utils.getUrlKey('payChannel')
    this.getStatus();
  }
};
</script>
<style scoped>
.topcard {
  width: 100%;
  height: 367px;
  background: #fff4f5;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}
.card-content-box {
  width: 100%;
  background: #ffffff;
  padding: 24px 0 0 24px;
  box-sizing: border-box;
}
.card-content {
  width: 100%;
  height: 65px;
  background: #ffffff;
  padding: 0 24px 24px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.eduname {
  padding-bottom: 4px;
  font-size: 14px;
}
.ordedesc {
  color: #666666;
  padding-bottom: 10px;
}
.icon {
  width: 100px;
  height: 100px;
}
.tips {
  font-size: 18px;
  color: #333333;
}
.smalltips {
  font-size: 14px;
  color: #e95652;
}
.icon img {
  width: 100%;
  height: 100%;
}
.row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666666;
  text-align: center;
}
.row span {
  flex: 1;
}
.graytips {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #afafaf;
}
.bottom {
  padding: 80px 0;
  position: relative;
}
.button-self {
  margin: auto;
}

/*.button-box {*/
  /*padding: 0 30px;*/
  /*width: 100%;*/
  /*display: flex;*/
  /*box-sizing: border-box;*/
/*}*/
/*.button-box .button-self {*/
  /*width: 140px;*/
/*}*/

.button-box .button-normal {
  background: #ffffff;
  color: #ff6290;
  border: 1px solid #ff6290;

}

.button-self {
  margin-bottom: 20px;
}

.back {
  background: #ffffff;
  border: 1px solid #ff6290;
  color: #ff6290;
  margin-bottom: 20px;
}
</style>

