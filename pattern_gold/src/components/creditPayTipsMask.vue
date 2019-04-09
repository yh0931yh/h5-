<template>
  <div class="mask" v-if="maskshow"
       @click="close">
    <div class="mask-wrapper">
      <div class="mask-body"
           @click.stop>
        <div class="tips">{{title}}</div>
        <img :src="imageName">
        <div class="small-tips">{{message}}</div>
        <p class="blue-tips"
           @click="close">知道了</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        maskshow: false
      };
    },
    props: ['title','message','imageName','confirmDisable', 'sendCodeParams'],
    methods: {
      open (opt) {
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
    z-index: 6;
    background: rgba(0, 0, 0, 0.4);
  }
  .mask-wrapper {
    position: relative;
  }

  .mask-body {
    position: absolute;
    top: 100px;
    left: 20px;
    right: 20px;
    height: 340px;
    background: #fff;
    border-radius: 25px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 20px 20px;
    box-sizing: border-box;
    align-items: center;
  }

  .mask-body > img {
    background-size:cover;
    width:246px;
    height: auto;
  }

  .tips {
    font-size: 17px;
    color: #1a1a1a;
    line-height: 24px;
    text-align: center;
    width: 246px;
  }
  .small-tips {
    font-size: 15px;
    color: #8B8B90;
    width: 246px;
  }

  .blue-tips {
    margin-top: 10px;
    font-size: 17px;
    color: #FF6290;
    line-height: 24px;
    text-align: center;
  }

</style>
