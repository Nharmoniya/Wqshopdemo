// #ifndef VUE3
import Vue from 'vue'
import App from './App'

//导入http请求的包
import {
	$http
} from '@escook/request-miniprogram'
Vue.config.productionTip = false

uni.$http = $http

//封装展示消息提示
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

//请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

//挂载请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '少女祈祷中...'
	})
	// 判断请求的是否为有权限的 API 接口
	if (options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: store.state.m_user.token,
		}
	}
}

//响应拦截器
$http.afterRequest = function(options) {
	uni.hideLoading()
}

//导入store的实例对象
import store from './store/store.js'



App.mpType = 'app'

const app = new Vue({
	...App,
	//将store挂载在Vue实例上
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
