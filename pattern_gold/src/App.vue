<template>
  <div id="app">
    <keep-alive>
      <transition :name="transitionName">
        <router-view class="Router"
          v-if="$route.meta.keepAlive"></router-view>
      </transition>
    </keep-alive>
    <transition :name="transitionName">
      <router-view class="Router"
        v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>
<script>
import { USER_TOKEN, USER_SIGN } from '@/utils'
import Cache from '@/utils/cache'
export default {
  name: 'App',
   computed: {
//     ...mapState({
//       token: 'token',
//       sign: 'sign'
//     })
   },
  data () {
    return {
      transitionName: 'slide-left' // 默认动态路由变化为slide-right
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('前一页 from = ' + from.query.timestamp)
      console.log('准备进入的页面是  to = ' + to.query.timestamp)
      if (from.query.timestamp) {
        if (to.query.timestamp > from.query.timestamp) {
          this.transitionName = 'slide-left'
        } else {
          this.transitionName = 'slide-right'
        }
      } else {
        this.transitionName = 'slide-left'
      }
    }
  },
  mounted () {
    this.setUserCon();
  },
  methods: {
    setUserCon () {
      let Base64 = require('js-base64').Base64;
      let env = process.env.NODE_ENV === 'development';
      let orgUserCon = env ? this.$utils.getUrlKey('usercon') : this.$utils.getCookie('usercon')
      let usercon = Base64.decode(orgUserCon)
      if (!orgUserCon && Cache.get(USER_TOKEN)) return
      let arr = usercon.split(',');
      console.log('arr', arr)
      Cache.set(USER_TOKEN, arr[0])
      Cache.set(USER_SIGN, arr[1])
//       Cache.set(USER_TOKEN, '80CDD3E39D20494F157FEE403A2F6A3C')
//       Cache.set(USER_SIGN, '7B55B12633202EB737B2B5D3DA7C7A92')
//      console.log(Cache.get(USER_TOKEN))
//      console.log(Cache.get(USER_SIGN))
      // this.$store.dispatch('setUserconAction', { token: arr[0], sign: arr[1] });
    }
  }
};
</script>

<style>
body,
p {
  padding: 0;
  margin: 0;
}
body {
  background: #fff;
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
.cube-toast-icon {
  display: none !important;
}
.cube-dialog-btn_highlight {
  color: #46a9ff !important;
}
.border-bottom-1px,
.border-left-1px,
.border-right-1px,
.border-top-1px {
  position: relative;
}
.border-top-1px:before {
  border-top: 1px solid #ebebeb;
  left: 0;
  top: 0;
  width: 100%;
  -webkit-transform-origin: 0 top;
  transform-origin: 0 top;
}
.border-right-1px:after {
  border-right: 1px solid #f5f5f5;
  top: 0;
  right: 0;
  height: 100%;
  -webkit-transform-origin: right 0;
  transform-origin: right 0;
}
.border-bottom-1px:after,
.border-bottom-1px:before,
.border-left-1px:after,
.border-left-1px:before,
.border-right-1px:after,
.border-right-1px:before,
.border-top-1px:after,
.border-top-1px:before {
  content: "";
  display: block;
  position: absolute;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
}
.button {
  cursor: pointer;
  background: #ff6290;
  border-radius: 25px;
  width: 285px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 18px;
}
</style>
<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>

