import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
/* eslint-disable */
export default new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [{
    path: '/',
    name: 'home',
    component: (resolve) => {
      require(['@/pages/home'], resolve);
    },
    meta: {
      keepAlive: true,
      title: '花果',
    },
  }, {
    path: '/fenqi',
    name: 'fenqi',
    component: (resolve) => {
      require(['@/pages/index'], resolve);
    },
    meta: {
      keepAlive: true,
      title: '花果分期',
    },
  }, {
    path: '/confirmPage',
    name: 'confirmPage',
    component: (resolve) => {
      require(['@/pages/confirmPage'], resolve);
    },
    meta: {
      title: '确认分期',
    },
  }, {
    path: '/confirm',
    name: 'confirm',
    component: (resolve) => {
      require(['@/pages/confirm'], resolve);
    },
    meta: {
      title: '确认分期',
    },
  }, {
    path: '/bindCard',
    name: 'bindCard',
    component: (resolve) => {
      require(['@/pages/bindCard'], resolve);
    },
    meta: {
      title: '绑定信用卡',
    },
  }, {
    path: '/installmentStatus',
    name: 'installmentStatus',
    component: (resolve) => {
      require(['@/pages/installmentStatus'], resolve);
    },
    meta: {
      title: '结果',
    },
  }, {
    path: '/myStage',
    name: 'myStage',
    component: (resolve) => {
      require(['@/pages/myStage'], resolve);
    },
    meta: {
      title: '我的分期',
    },
  }, {
    path: '/myStageDetail',
    name: 'myStageDetail',
    component: (resolve) => {
      require(['@/pages/myStageDetail'], resolve);
    },
    meta: {
      title: '我的分期',
    },
  }, {
    path: '/qrcodeDetail',
    name: 'qrcodeDetail',
    component: (resolve) => {
      require(['@/pages/qrcodeDetail'], resolve);
    },
    meta: {
      title: '我的分期',
    },
  }, {
    path: '/test',
    name: 'test',
    component: (resolve) => {
      require(['@/pages/test'], resolve);
    },
    meta: {
      title: '掌上生活支付',
    },
  }, {
    path: '/netconfirm/:orderNo',
    name: 'netconfirm',
    component: (resolve) => {
      require(['@/pages/netconfirm'], resolve);
    },
    meta: {
      title: '确认分期',
    },
  }, {
    path: '/bindCardF',
    name: 'bindCardF',
    component: (resolve) => {
      require(['@/pages/bindCardF'], resolve);
    },
    meta: {
      title: '绑定信用卡',
    },
  }, {
    path: '/bindCardFTwo',
    name: 'bindCardFTwo',
    component: (resolve) => {
      require(['@/pages/bindCardF/step_two'], resolve);
    },
    meta: {
      title: '绑定信用卡',
    },
  }, {
    path: '/bindCardFTwoPay',
    name: 'bindCardFTwoPay',
    component: (resolve) => {
      require(['@/pages/bindCardF/step_two_pay'], resolve);
    },
    meta: {
      title: '绑定信用卡',
    },
  }, {
    path: '/html/:type',
    name: 'html',
    component: (resolve) => {
      require(['@/pages/webhtml'], resolve);
    }
  }]
});

/* eslint-enable */
