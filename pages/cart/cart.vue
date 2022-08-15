<template>
	<!-- 购物车商品列表的标题区域 -->
	<view class="cart-title">
		<!-- 左侧的图标 -->
		<uni-icons type="shop" size="18"></uni-icons>
		<!-- 描述文本 -->
		<text class="cart-title-text">购物车</text>
		<!-- 商品列表区域 -->
		<block v-for="(goods, i) in cart" :key="i">
		  <my-goods :goods="goods"></my-goods>
		  <!-- 商品左侧图片区域 -->
		  <view class="goods-item-left">
		    <radio checked color="#058b8c"></radio>
		    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		  </view>
		</block>
	</view>
	
</template>

<script>
import { mapState } from 'vuex';
import badgeMix from '@/mixins/tabbar-badge.js';

export default {
	mixins: [badgeMix],
	computed: {
		...mapState('m_cart', ['cart']),
	},
	data() {
		return {};
	},
	onShow() {
		this.setBadge();
	},
	methods: {
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				text: this.total + ''
			});
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
.goods-item-left {
  margin-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .goods-pic {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
