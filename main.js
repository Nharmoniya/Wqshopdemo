
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

//导入http请求的包
import { $http } from '@escook/request-miniprogram'
Vue.config.productionTip = false

uni.$http = $http

//请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

//挂载请求拦截器
$http.beforeRequest = function(options){
	uni.showLoading({
	  title:'少女祈祷中...'
	})
}

//响应拦截器
$http.afterRequest = function(options){
	uni.hideLoading()
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif