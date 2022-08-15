<template>
	<view>Cart</view>
</template>

<script>
import { mapGetters } from 'vuex';
import badgeMix from '@/mixins/tabbar-badge.js';
export default {
	data() {
		return {};
	},
	computed: {
		...mapGetters('m_cart', ['total'])
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
	},
	mixins: [badgeMix],
};
</script>

<style lang="scss"></style>
