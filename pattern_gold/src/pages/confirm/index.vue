<template>
  <div>
    <div class='card-top'>
      <p>总分期金额（元）</p>
      <h3>{{(bankInfo && bankInfo.orderAmt) || 0}}</h3>
    </div>
    <div class='item'>
      <span>收款方</span>
      <span>{{(bankInfo && bankInfo.eduName) || ''}}</span>
    </div>
    <div class='line'></div>
    <div class='select-type'>
      选择分期方式
    </div>
    <!--用户已绑信用卡-->
    <div v-show="hasBindCards">
      <lists type="bindCard"
        class="card-list"
        v-show='hasBindCards'
        :checkBankId='checkBankId'
        :dataSource='dataSource'
        @checkEvent='hascheckEvent'></lists>
      <div class='line'></div>
    </div>
    <div>
      <div v-show="item.payChannelType =='CMB'"
        v-for="item in payChannelList"
        :key="item.payChannelId"
        class="channel-item"
        @click="selectPayType(item)">
        <div class="channel-item-left">
          <img :src="item.payChannelLogoUrl" />
        </div>
        <div class="channel-item-right">
          <span class="title">{{item.payChannelName}}</span>
          <span class="txt">{{item.payChannelDesc}}</span>
        </div>
      </div>
      <div v-show="item.payChannelType !='CMB'"
        v-for="item in payChannelList"
        :key="`${item.payChannelType}-$item.payChannelId}`"
        @click="selectPayType(item)"
        class="channel-item">
        <div class="channel-item-left">
          <img src="static/images/icon_bank.jpg" />
        </div>
        <div class="channel-item-right">
          <span class="title">{{hasBindCards ? '添加新的信用卡': '信用卡支付' }}</span>
          <span class="txt">支持主流信用卡，1秒分期</span>
        </div>
      </div>
    </div>
    <div class='button button-self'
      @click='next'>确认</div>
    <bank @checkEvent='checkEvent'
      ref='bank'
      :dataSource='supCardList'
      :checkBankId='checkBankId'></bank>
    <sms-code-mask ref="smscodeMask"
                   :sign="sign"
                   :token="token"
                   :regainCode = "regainCode"
      @confirm="confirm"
      :orderId="orderId"
      @sendCode="sendCode"></sms-code-mask>
    <div id="html"></div>
  </div>
</template>
<script>
import lists from '@/components/list';
import bank from '@/components/selectbank';
import SmsCodeMask from '@/components/smscodeMask';
import { USER_TOKEN, USER_SIGN, checkBrowser } from '@/utils'
import Cache from '@/utils/cache'
export default {
  data () {
    return {
      bankInfo: {
      },
      sign: '',
      token: '',
      hasBindCards: true,
      dataSource: [],
      orderId: '',
      supCardList: [],
      checkBankId: null,
      checkBankName: null,
      payChannelList: [],
      payChannelType: '',
      payChannelId: '',
      regainCode:false
    };
  },
  components: {
    lists,
    bank,
    SmsCodeMask
  },
  methods: {
    selectPayType (item) {
      this.payChannelType = item.payChannelType
      this.payChannelId = item.payChannelId
      if (item.payChannelType == 'CMB') {
        this.cmbPay(item)
      } else {
        this.addNewCard()
      }
    },
    // 掌上生活支付
    cmbPay (item) {
      let params = {
        orderId: this.orderId,
        payChannelId: item.payChannelId
      }
      this.payChannelType = item.payChannelType
      this.payChannelId = item.payChannelId
      let broser = checkBrowser()
      if (broser.isWeixin) {
        // 微信浏览器跳转
        if (broser['versions'] == 'android') {
          const url = `/test`;
          this.$router.push({
            path: url,
            query: {
              timestamp: (new Date()).getTime(),
              orderId: this.orderId,
              payChannelId: item.payChannelId,
              payChannelType: item.payChannelType,
              token: this.token,
              sign: this.sign
            } });
        } else {
          const url = `/test?timestamp=${(new Date()).getTime()}&orderId=${this.orderId}&payChannelId=${item.payChannelId}&payChannelType=${item.payChannelType}&token=${this.token}&sign=${this.sign}`
          window.location.href = `${window.location.origin}/hyj-web/index.html#${url}`
        }
      } else {
        this.payRequestEvent(params)
      }
    },
    /**
     * 选择信用卡事件
    */
    checkEvent (item) {
      const params = {
        orderId: this.orderId,
        bankInfo: item
      }
      Cache.set('BANKINFO', params)
      if (this.payChannelType == 'Yeepay') {
        const url = `/bindCard?payChannelId=${this.payChannelId}`;
        this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
      } else if (this.payChannelType == 'FQY') {
        const url = `/bindCardFTwoPay?payChannelId=${this.payChannelId}`;
        this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
      }
    },
    /**
     * 选择信用卡
     * @param id
     * @param name
     */
    hascheckEvent (item) {
      this.checkBankId = item.id;
      this.checkBankName = item.name;
      this.payChannelId = item.payChannelId
      this.payChannelType = item.payChannelType
    },
    /**
     * 添加信用卡
     */
    addNewCard () {
      let bank = this.$refs.bank;
      bank.open();
    },
    /** 确认按钮事件
     * 1. 选择信用卡
     * 2. 提交 参数 { orderId, userBindBankId}
     */
    next () {
      if (!this.checkBankId) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '请选择信用卡'
        });
        toast.show();
        return;
      }
      let params = {
        orderId: this.orderId,
        userBindBankId: this.checkBankId
      }
      this.payRequestEvent(params)
    },
    payRequestEvent (params) {
      let smscodeMask = this.$refs.smscodeMask;
      let param = {
        url: this.$fetchApi.payRequest,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: true,
        vm: this,
        params
      };
      this.$utils.http(param).then(res => {
        if (res.head.code === '0000') {
          // 非易宝支付 ---- 掌上生活支付
          if (res.body.payProtocol) {
            // eslint-disable-next-line no-undef
            cmblife.executeProtocol(res.body.payProtocol)
          } else {
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
    getBankInfo () {
      let _this = this;
      let param = {
        url: this.$fetchApi.getBankInfo,
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
            console.log(res);
            this.bankInfo = {
              eduName: res.body.eduName,
              orderAmt: _this.$utils.moneyFix(res.body.orderAmt),
              orderId: res.body.orderId
            }
            this.payChannelList = res.body.payChannelList ? res.body.payChannelList : []
            this.hasBindCards = res.body.hasBindCards;
            this.supCardList = res.body.supCardList;
            this.dataSource = res.body.hasBindCards ? res.body.bindCardList : []
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
    confirm (smscode,againcode) {
      console.log('目前是啥'+againcode);
      this.regainCode = againcode;
      if (!this.regainCode) {
        const toast = this.$createToast({
          time: 1500,
          type: 'warn',
          txt: '验证码已失效，请重新获取'
        });
        toast.show();
        console.log('111')
        return;
      }

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
          if (res.head.code === '0000') {
            const toast = this.$createToast({
              time: 1500,
              type: 'correct',
              txt: res.head.msg
            });
            toast.show();
            smscodeMask.close();
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
          } else if (res.head.code === '1000' || res.head.code === '9000') {
            this.againCode = false;
            smscodeMask.close();
            const url = `/installmentStatus?tranNo=${res.body.tranNo}&payChannel=${res.body.payChannel}`;
            this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
          }
          else if (res.head.code === '2000') {
            this.regainCode = false;
            console.log('1111')
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
          } else if (res.head.code == '4000') {
            if (res.body.needSupply && res.body.needSupply == 'Y') {
              smscodeMask.close();
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
                  const url = `/bindCardFTwo`;
                  this.$router.push({ path: url, query: { timestamp: (new Date()).getTime() } });
                },
                onCancel: () => {
                  this.close()
                }
              }).show()
            } else {
              smscodeMask.close();
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
            smscodeMask.close();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    sendCode (params) {
      const toast = this.$createToast({
        time: 1500,
        type: 'error',
        txt: params.head.msg
      });
      Cache.set('BANKINFO', { orderId: this.orderId, bankInfo: { id: this.checkBankId } })
      toast.show();
      const url = `/bindCardFTwo?from=card'`;
      this.$router.push({
        path: url,
        query: {
          timestamp: (new Date()).getTime()
        }
      });
    }
  },
  mounted () {
    this.orderId = this.$utils.getUrlKey('orderId');
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.getBankInfo();
  }
};
</script>
<style scoped>
.card-top {
  width: 100%;
  height: 132.5px;
  padding: 35px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff4f5;
  font-size: 14px;
  color: #afafaf;
  justify-content: space-between;
  flex-direction: column;
}
.card-top h3 {
  color: #333;
  font-size: 36px;
  margin: 0;
  padding: 0;
}
.item {
  padding: 0 37px;
  height: 50px;
  font-size: 14px;
  color: #4a4a4a;
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.line {
  height: 15px;
  background: #efefef;
}
.select-type {
  line-height: 40px;
  font-size: 12px;
  color: #666;
  padding-left: 35px;
  border-bottom: 1px solid #e1e1e1;
}
.check-newcard {
  line-height: 50px;
  display: flex;
  padding: 0 35px;
  font-size: 14px;
  color: #4a4a4a;
  justify-content: space-between;
  background: #f8f8f8;
}
.button-self {
  margin: 30px auto;
}
.channel-item {
  display: flex;
  align-content: flex-start;
  height: 60px;
  padding: 15px 30px;
  border-bottom: 1px solid #e1e1e1;
  box-sizing: border-box;
}
.channel-item-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  line-height: 1;
}
.channel-item-left img {
  width: 15px;
  height: 15px;
  margin-right: 6px;
}
.channel-item .title {
  color: #4a4a4a;
  font-size: 14px;
}
.channel-item .txt {
  font-size: 10px;
  color: #666;
}
</style>


