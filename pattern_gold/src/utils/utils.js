let util = {};

const ajaxUrl = process.env.NODE_ENV === 'development'
  // 测试接口地址
  ? 'code.net.cn/api'
  // 线上接口地址
  : 'https://api.code.net.cn';

util.API = ajaxUrl;
util.oauthUrl = ajaxUrl;

export default util;
