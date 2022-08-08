<template>
	<view class="swof">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图item -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<view class="swiper-item"><image :src="item.image_src"></image></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			swiperList: []
		};
	},
	onLoad() {
		this.getSwiperList();
	},
	methods: {
		//获取轮播图数据
		async getSwiperList() {
			//发起请求
			const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
			if (res.meta.status !== 200) {
				return uni.showToast({
					title: '数据请求失败！',
					duration: 1500,
					icon: 'none'
				});
			}
			this.swiperList = res.message;
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
</style>
