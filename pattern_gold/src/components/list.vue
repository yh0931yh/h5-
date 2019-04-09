<template>
<div>
  <div class="list" v-for="(item) in dataSource" :key="item.id">
    <div class="list-item" @click="checkEvent(item)">
      <div class="left">
        <p class="title">
          <img class="icon" :src="item.logoUrl" />
          <span>{{type== 'bindCard' ?  item.cardDesc : item.bankName}}</span>
        </p>
        <p class="txt">{{'信用卡'}}</p>
      </div>
      <div class="right" :class="item.id==checkBankId ? 'check': 'ucheck'">
        <img src="static/images/icon_check.png" />
      </div>
    </div>
  </div>


</div>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: []
    },
    checkBankId: {
      type: Number,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    checkEvent (id, bankName) {
      this.$emit('checkEvent', id, bankName)
    }
  }
};
</script>

<style scoped>
.list-item {
  padding: 0 30px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #e1e1e1;
}
.left {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #4a4a4a;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  justify-content: space-between;
}
.left .icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.left .txt {
  padding-left: 20px;
  font-size: 10px;
  color: #666;
}
.left .title {
  display: flex;
  align-items: center;
}
.right {
  position: relative;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #f2f2f2;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.09);
}
.right.ucheck img {
  display: none;
}
.right.check img {
  position: absolute;
  width: 16px;
  height: 12px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>

