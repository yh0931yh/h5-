<template>
  <div style='background: #efefef; min-height: 100vh; overflow: auto;' :style= "{background: list.length <=0 ? '#FFF4F5' : '#efefef'}">
   <mt-loadmore
    v-show="list.length>0"
    ref='loadmore'
    :bottom-method="getList"
    :autoFill="false"
    :bottom-all-loaded="allLoaded"
   >  
    <a 
      class='item'
      v-for="(item) in list"
      :key="item.id"
      @click="$router.push(`/myStageDetail?orderId=${item.id}&timestamp=${(new Date()).getTime()}`);">
      <p class='item-tips'>{{(item && item.month) || ''}}</p>
      <div class='item-center'>
        <div class='left'>
          <div class='icon'>{{(item && item.eduName.substr(0,1)) || ''}}</div>
          <div class='left-center'>
            <p>{{(item && item.eduName) || ''}}</p>
            <p class='small'>{{(item && item.createTime) || ''}}</p>
          </div>
        </div>
        <div class="center" :class='status_map[item.orderStatus]'>          
          <span style="color: #d0021b;" v-if="item && item.hasRefund=='Y'">{{(item && item.refundStatusDesc) || ''}}</span>
          <span v-else>{{(item && item.orderStatusDesc) || ''}}</span>
        </div>
        <div class='right'>
          <div class='money'>¥  {{item && item.orderAmt}} </div>
          <div class='small'>分{{(item && item.periods) || 0 }}期</div>
        </div>
      </div>
    </a>
    <div v-show="allLoaded && list.length>=10" class="bottom-tips">
      <span>- 到底了 -</span>
    </div>
    </mt-loadmore>
    <div class="nodata" v-show="list.length <=0 ">
      <img src="static/images/no-more.png">
      <span>暂无分期订单</span>
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
      page: 1,
      list: [],
      allLoaded: false,
      size: 10,
      status_map: {
        'INIT': 'other',
        'ING': 'other',
        'FAIL': 'other',
        'CLOSE': 'other',
        'CONFIRM': 'blue',
        'SUCC': 'succ'
      }
    };
  },
  methods: {
    getList () {
      let param = {
        url: this.$fetchApi.orderList,
        type: 'POST',
        sign: this.sign,
        token: this.token,
        isLoading: false,
        vm: this,
        params: {
          page: this.page,
          size: this.size
        }
      };
      this.$utils
        .http(param)
        .then(res => {
          if (res.head.code === '0000') {
            this.page = this.page + 1;
            if (res.body.list) {
              this.list = this.list.concat(res.body.list);
              if (res.body.list.length < this.size) {
                this.allLoaded = true;
                this.$refs.loadmore.onBottomLoaded();
              }
            } else {
              this.allLoaded = true;
              this.$refs.loadmore.onBottomLoaded();
            }
          } else if (res.head.code === '8000') {
            let _this = this;
            let login = this.$createLogin({
              onClick (e) {
                _this.loginEvent();
              }
            });
            login.open();
          } else {
            const toast = this.$createToast({
              time: 1500,
              type: 'error',
              txt: res.head.msg
            });
            toast.show();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginEvent () {
      this.sign = Cache.get(USER_SIGN)
      this.token = Cache.get(USER_TOKEN)
      const url = `/`;
      this.$router.push(url);
    }
  },
  mounted () {
    this.sign = Cache.get(USER_SIGN)
    this.token = Cache.get(USER_TOKEN)
    this.getList();
  }
};
</script>

<style scoped>
.bottom-tips {
  text-align: center;
  font-size: 14px;
  color: #666666;
  line-height: 40px;
}
.item-tips {
  line-height: 25px;
  font-size: 12px;
  color: #666666;
  background: #efefef;
  padding-left: 25px;
}

.item {
  display: block;
}
.item:active .item-center {
  background: #efefef;
}
.item-center {
  background: #ffffff;
  height: 84px;
  width: 100%;
  padding: 18px 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-center .left {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 14px;
  color: #4a4a4a;
}
.item-center .center {
  flex: 1;
  text-align: right;
  font-size: 10px;
  flex-grow: 4;
  align-items: flex-end;
}
.error {
  color: #d0021b;
}
.other {
  /* color: #f5a623; */
  color: #46A9FF;
}
.orange {
  color: #f5a623;
}
.icon {
  margin-right: 15px;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 50%;
  background: #dc2e2e;
  font-size: 18px;
  line-height: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
.left-center {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;  
  padding: 5px 0;
  box-sizing: border-box;
}
.small {
  font-size: 10px;
  color: #666666;
  font-weight: normal;
}
.right {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
  box-sizing: border-box;
  height: 100%;
  width: 80px;
  flex-shrink: 0;
  flex-grow: 0;
  font-size: 15px;
  color: #000000;
  font-weight: bold;
}
.nodata {
  width: 100vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.nodata img{
  width: 108px;
  height: 120px;
}
.nodata span {
  font-size: 18px;
  margin-top: 30px;
  color: #333333;
}
</style>

