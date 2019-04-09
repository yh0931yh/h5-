<template>
  <div class='mask' v-if='maskshow' @click='close'>
    <div class='mask-wrapper'>
      <div class='mask-body' @click.stop>
        <div class='tips'>
          请向商户出示二维码<br/>
          确认支付结果
        </div>
      <vue-qr class='qrcode' :text='config.value' :size='200' :margin='0'></vue-qr>
      <div class='button' @click='close'>完成</div>
      </div>
    </div>   
  </div>
</template>
<script>
import VueQr from 'vue-qr'
export default {
  data () {
    return {
      maskshow: false,
      config: {
        value: 'http://192.168.31.154:8080/index.html/#/myStageDetail'
      }
    };
  },
  components: {
    VueQr
  },
  methods: {
    open (opt) {
      this.close();
      console.log(opt)
      this.config.value = opt.value;
      this.maskshow = true;
    },
    close () {
      this.maskshow = false;
    }
  }
};
</script>
<style scoped>
.mask {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.4);
}
.mask-wrapper {
  position: relative;
}
.mask-body {
  position: absolute;
  top: 50px;
  left: 25px;
  right: 25px;
  height: 440px;
  background: #fff;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  box-sizing: border-box;
  align-items: center;
}
.tips {
  font-size: 20px;
  color: #333333;
  line-height: 30px;
  text-align: center;
}
.qrcode {
  margin: 30px;
}
</style>


