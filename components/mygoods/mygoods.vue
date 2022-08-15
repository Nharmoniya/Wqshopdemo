<template>
	<view>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<radio :checked="goods.goods_state" color="#058b8c" v-if="showRadio" @click="radioClickHandler"></radio>
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{ goods.goods_name }}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{ goods.goods_price | tofixed }}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'mygoods',
	data() {
		return {
			//防止接口传过来的图片没有值，因此定义一个默认图片
			defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
		};
	},
	filters: {
		//保留两位小数
		tofixed(num) {
			return Number(num).toFixed(2);
		}
	},
	props: {
		//商品信息的对象
		goods: {
			type: Object
		},
		// 是否展示图片左侧的 radio
		showRadio: {
			type: Boolean,
			// 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
			default: false
		},
		//是否展示价格右侧的Numberbox组件
		showNum:{
			type:Boolean,
			default:false,
		}
	},
	methods: {
		//radio组件的点击事件处理函数
		radioClickHandler() {
			//通过$emit传事件对props进行修改
			this.$emit('radio-change', {
				//商品的ID
				goods_id: this.goods.goods_id,
				//商品最新的勾选状态
				goods_state: !this.goods.goods_state
			});
		},
		numChangeHandler(val){
			this.$emit('num-change',{
				//商品的id
				goods_id:this.goods.goods_id,
				//商品的数量
				goods_count:+val
			})
		}
	}
};
</script>

<style lang="scss">
.goods-item {
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;

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

	.goods-item-right {
		display: flex;
		flex:1;
		flex-direction: column;
		justify-content: space-between;

		.goods-name {
			font-size: 13px;
		}

		.goods-info-box {
		    display: flex;
		    align-items: center;
		    justify-content: space-between;
		}

		.goods-price {
			font-size: 16px;
			color: #058b8c;
		}
	}
}
</style>
