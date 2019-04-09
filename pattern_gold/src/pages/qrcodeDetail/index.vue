<template>
  <div>
    <div class="page">
      <div class="left">
        <!-- <img src="/static/images/status_loading.png" /> -->
        <img src="static/images/status_fail.png" />
      </div>
      <div class="right error">
        <p class="tips">收款失败</p>
        <p class="small-tips">可能由于银联系统问题，导致分期失败，请与客户沟通</p>
        <p class="money">¥ 10000.00</p>
        <div class="info">
          <p class="info-item">
            <span>收款商户</span><span>东书房静安店</span>
          </p>
          <p class="info-item">
              <span>收款时间</span><span>2018.05.23  12:30</span>
          </p>
          <p class="info-item">
              <span>付款方式</span><span>信用卡分期</span>
          </p>
          <p class="info-item">
          <span>交易号</span><span>873827382</span>
          </p>         
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
 
export default {
   data  () {
     return {

     }
   }
}
</script>

<style scoped>
.page {
  height: 326px;
  background: #fff4f5;
  display: flex;
  padding: 46px 40px 0 65px;
  box-sizing: border-box;
}
.left {
  align-self: flex-start;
  margin-right: 20px;
}
.left img {
  margin-top: 15px;
  width: 30px;
  height: 30px;
}
.error {
  color: #E95D59!important;
}
.right {
  color: #666666;
}
.tips {
  font-size: 14px;  
  line-height: 20px;
}
.small-tips {
  font-size: 12px;
  margin-top: 5px;
}
.money {
  font-size: 36px;
  color: #ff6290;
  margin-top: 22px;
  margin-bottom: 30px;
  font-weight: bold;
  line-height: 1;
}

.info-item {
  display: flex;
  font-size: 12px;
  color: #666666;
}
.info-item span:nth-child(2n + 1) {
  width: 50px;
  margin-right: 20px;
  line-height: 30px;
}
.info-item span:nth-child(2n) {
  font-size: 12px;
  color: #1a1a1a;
  line-height: 30px;
}
</style>

