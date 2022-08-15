import Vue from 'vue'
import Vuex from 'vuex'
import Cart from './cart.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		m_cart:Cart
	},
})

export default store