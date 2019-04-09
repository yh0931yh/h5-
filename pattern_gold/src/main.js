import Vue from 'vue';
import Vuex from 'vuex'
import 'lib-flexible/flexible'
import utils from './utils' // 获取url参数
import fetchApi from './utils/fetch'
import App from './App'
import router from './router'
import store from './vuex/index' // store
import Login from './components/login.vue'
import {
  Loadmore,
  Field
} from 'mint-ui'
import {
  /* eslint-disable no-unused-vars */
  Toast,
  Dialog,
  createAPI,
} from 'cube-ui'

Vue.component(Loadmore.name, Loadmore);
Vue.component(Field.name, Field);

Vue.prototype.$utils = utils // 注册全局方法
Vue.prototype.$fetchApi = fetchApi
Vue.config.productionTip = false;

Vue.use(Vuex)
Vue.use(Toast)
Vue.use(Dialog)
// 创建 this.$createHello API
createAPI(Vue, Login, ['click'], true)

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
// const app = new Vue(App)
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
});
/* eslint-disable */
