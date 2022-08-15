<template>
	<view>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<block v-for="(goods, i) in cart" :key="i"><mygoods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true" @num-change="numberChangeHandler"></mygoods></block>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import badgeMix from '@/mixins/tabbar-badge.js';

export default {
	mixins: [badgeMix],
	computed: {
		...mapState('m_cart', ['cart'])
	},
	onLoad() {
		console.log('cart的值');
		console.log(this.cart);
	},
	methods: {
		...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount']),
		// 商品的勾选状态发生了变化
		radioChangeHandler(e) {
			this.updateGoodsState(e);
		},
		// 商品的数量发生了变化
		numberChangeHandler(e) {
			this.updateGoodsCount(e);
		}
	}
};
</script>

<style lang="scss">
.cart-title {
	height: 40px;
	display: flex;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	.cart-title-text {
		margin-left: 10px;
	}
}
</style>
