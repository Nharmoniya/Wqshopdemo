<template>
	<view class="swof">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图item -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"><image :src="item.image_src"></image></navigator>
			</swiper-item>
		</swiper>
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i"><image :src="item.image_src" class="nav-img"></image></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			swiperList: [],
			navList: []
		};
	},
	onLoad() {
		this.getSwiperList();
		this.getNavList();
	},
	methods: {
		//获取轮播图数据
		async getSwiperList() {
			//发起请求
			const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
			if (res.meta.status !== 200) return uni.$showMsg();
			this.swiperList = res.message;
		},
		async getNavList() {
			const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
			if (res.meta.status !== 200) return uni.$showMsg();
			this.navList = res.message;
		}
	}
};
</script>

<style lang="scss">
swiper {
	height: 330rpx;
	padding: 10px;
	border-radius: 30rpx;
	overflow: hidden;
	.swiper-item,
	image {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
	}
}
.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 15px 0;

	.nav-img {
		width: 128rpx;
		height: 140rpx;
	}
}
</style>
