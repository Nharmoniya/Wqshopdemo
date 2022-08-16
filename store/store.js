import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 导入用户的 vuex 模块
import moduleUser from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		m_cart: moduleCart,
		// 挂载用户的 vuex 模块，访问路径为 m_user
		m_user: moduleUser,
	},
})

export default store
