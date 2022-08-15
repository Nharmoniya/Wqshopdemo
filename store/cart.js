export default {
	namespaced: true,

	state: () => ({
		//用来存储购物车信息
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	mutations: {
		addtoCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id);

		if (!findResult) {
			//如果购物车中没有商品，则直接push
			state.cart.push(goods);
		} else {
			//如果购物车中有这件商品，则只更新数量即可
			findResult.goods_count++;
		}
		this.commit('m_cart')
	},
	saveToStorage(state){
		uni.setStorageSync('cart',JSON.stringify(state.cart))
	}
},
	getters: {
		total(state){
			let c=0
			//循环统计商品的数量
			state.cart.forEach(goods=>c+=goods.goods_count)
			return c
		}
	},
}
