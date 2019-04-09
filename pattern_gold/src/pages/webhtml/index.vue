<template>
  <div v-html="html"></div>
</template>

<script>
import Fly from 'flyio/dist/npm/fly';
const loginUrl = '/static/html/login_pact.html'
let BASE_URL = process.env.NODE_ENV === 'development' ? '' : 'http://192.168.31.215:8080/hyj-web';

export default {
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    this.getHtml()
  },
  methods: {
    getHtml () {
      let fly = new Fly()
      fly.request(`${BASE_URL}${loginUrl}`, null, {
        accept: 'text/html, text/plain',
        method: 'get'
      }).then(res => {
        this.html = res.data
        document.title = '用户注册协议'
      })
    }
  }
}
</script>
