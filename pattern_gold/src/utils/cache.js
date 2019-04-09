class LocalStorageCache {
  constructor () {
    this.name = 'cache.js'
  }
  set (key, value) {
    try {
      value = typeof value == 'object' ? JSON.stringify(value) : value
      window.localStorage.setItem(key, value)
    } catch (e) {
      window.alert('浏览器不支持LocalStorage')
    }
  }
  get (key, isObj = false) {
    try {
      var data = window.localStorage.getItem(key)
      if (data == 'undefined') {
        return null
      } else {
        return isObj ? JSON.parse(data) : data
      }
    } catch (e) {
      window.alert('浏览器不支持LocalStorage')
    }
  }
  del (key) {
    try {
      window.localStorage.removeItem(key)
    } catch (e) {
      // alert('浏览器不支持LocalStorage')
    }
  }
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }
  clear () {
    try {
      window.localStorage.clear()
    } catch (e) {
      window.alert('浏览器不支持LocalStorage')
    }
  }
}
export default new LocalStorageCache()
