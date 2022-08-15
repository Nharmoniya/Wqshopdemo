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
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<mygoods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true" @num-change="numberChangeHandler"></mygoods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import badgeMix from '@/mixins/tabbar-badge.js';

export default {
	mixins: [badgeMix],
	data() {
		return {
			options: [
				{
					text: '删除', //显示的文本内容
					style: {
						backgroundColor: '#058b8c'
					}
				}
			]
		};
	},
	computed: {
		...mapState('m_cart', ['cart'])
	},
	methods: {
		...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
		// 商品的勾选状态发生了变化
		radioChangeHandler(e) {
			this.updateGoodsState(e);
		},
		// 商品的数量发生了变化
		numberChangeHandler(e) {
			this.updateGoodsCount(e);
		},
		swipeActionClickHandler(goods) {
			uni.showLoading({
				title: '正在删除中...',
				mask: true
			});
			setTimeout(() => {
				this.removeGoodsById(goods.goods_id);
				uni.hideLoading();
				uni.redirectTo({
					url:'/pages/cart/cart'
				})
			}, 600);
		}
	},

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
