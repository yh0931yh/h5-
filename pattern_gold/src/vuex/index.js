import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    token: '',
    sign: '',
    orderInfo: null,
    eduInfo: {},
    routeMap: null
  },
  mutations: {
    setUsercon (state, usercon) {
      state.sign = usercon.sign;
      state.token = usercon.token;
    },
    setOrderInfo (state, orderInfo) {
      state.orderInfo = {...orderInfo}
    },
    setEduInfo (state, eduInfo) {
      state.orderInfo = {...eduInfo}
    },
    setRouteMap (state, routeMap) {
      state.routeMap = {...routeMap}
    }
  },
  actions: {
    setUserconAction (context, usercon) {
      context.commit('setUsercon', usercon)
    },
    setOrderInfoAction (context, orderInfo) {
      context.commit('setOrderInfo', orderInfo)
    },
    setEduInfoAction (context, eduInfo) {
      context.commit('setEduInfo', eduInfo)
    },
    setRouteMapAction (context, routeMap) {
      context.commit('setRouteMap', routeMap)
    }
  }
})

export default store
