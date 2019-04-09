<template>
  <div class="mask" v-show="maskShow" @click="close">
    <div class="mask-wrapper">
      <div class="mask-body" @click.stop :class="cardShow ?  'mask-show' : 'mask-hide'">
        <div class="title">
          <span>确认银行</span>
        </div>
        <lists
          :checkBankId="checkBankId"
          class="list"
          :dataSource="dataSource"
          @checkEvent="checkEvent"
        ></lists>
      </div>
    </div>
  </div>
</template>
<script>
import lists from '@/components/list';
export default {
  data () {
    return {
      maskShow: false,
      cardShow: false
    };
  },
  props: {
    dataSource: {
      type: Array,
      default: ()=>[]
    },
    checkBankId: {
      type: Number,
      default: ''
    }
  },
  components: {
    lists
  },
  methods: {
    open (opt) {
      // this.close();
      this.maskShow = true;
      let _this = this;
      setTimeout(function () {
        _this.cardShow = true;
      }, 100)
    },
    close () {
      let _this = this;
      _this.cardShow = false;
      setTimeout(function () {
        _this.maskShow = false;
      }, 500)
    },
    checkEvent (item) {
      this.$emit('checkEvent', item);
    }
  }
};
</script>
<style scoped>
.mask {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
  height: 100vh;
  top: 0;
}

.mask-wrapper {
  position: relative;
  height: 100%;
}
.mask-body {
  position: absolute;
  left: 0;
  right: 0;
  transition: all .8s;
  background: #fff;
  height: 454px;
  bottom: -454px;
}
.mask-show {
  bottom: 0;
}
.mask-hide {
  bottom: -454px;
}
.title {
  width: 100%;
  height: 65px;
  background: #fff4f5;
  text-align: center;
  font-size: 18px;
  line-height: 65px;
  color: #1a1a1a;
}
.list {
  max-height: 389px;
  overflow-y: auto;
}

</style>

