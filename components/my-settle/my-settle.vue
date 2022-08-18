<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#058b8c" :checked="isFullCheck" />
			<text>全选</text>
		</label>
		<!-- 合计区域 -->
		<view class="amount-box">
			合计:
			<text class="amount">{{ checkedGoodsAmount }}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
	</view>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			//倒计时
			seconds: 3,
			timer: null
		};
	},
	computed: {
		...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
		// addstr 是详细的收货地址
		...mapGetters('m_user', ['addstr']),
		//是否全选
		// token 是用户登录成功之后的 token 字符串
		...mapState('m_user', ['token']),
		...mapState('m_cart',['cart']),
		isFullCheck() {
			return this.total === this.checkedCount;
		},
	},
	methods: {
		...mapMutations('m_cart', ['updateAllGoodsState']),
		// 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
		...mapMutations('m_user', ['updateRedirectInfo']),
		// label 的点击事件处理函数
		changeAllState() {
			// 修改购物车中所有商品的选中状态
			// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
			this.updateAllGoodsState(!this.isFullCheck);
		},
		//结算按钮
		settlement() {
			//判断是否勾选要结算的商品
			if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品');
			//再判断是否选择了收货地址
			if (!this.addstr) return uni.$showMsg('请选择收货地址！');
			//再次判断是否已经登录
			if (!this.token) {
				return this.delayNavigate();
			}
			//实现微信支付
			this.payOrder();
		},
		// 展示倒计时的提示消息
		showTips(n) {
			// 调用 uni.showToast() 方法，展示提示消息
			uni.showToast({
				// 不展示任何图标
				icon: 'none',
				// 提示的消息
				title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
				// 为页面添加透明遮罩，防止点击穿透
				mask: true,
				// 1.5 秒后自动消失
				duration: 1500
			});
		},
		// 延迟导航到 my 页面
		delayNavigate() {
			// 把 data 中的秒数重置成 3 秒
			this.seconds = 3;
			this.showTips(this.seconds);
			// 1. 将定时器的 Id 存储到 timer 中
			this.timer = setInterval(() => {
				this.seconds--;
				// 2. 判断秒数是否 <= 0
				if (this.seconds <= 0) {
					// 2.1 清除定时器
					clearInterval(this.timer);
					// 2.2 跳转到 my 页面
					uni.switchTab({
						url: '/pages/my/my',
						// 页面跳转成功之后的回调函数
						success: () => {
							// 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
							this.updateRedirectInfo({
								// 跳转的方式
								openType: 'switchTab',
								// 从哪个页面跳转过去的
								from: '/pages/cart/cart'
							});
						}
					});
					// 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
					return;
				}
				this.showTips(this.seconds);
			}, 1000);
		},
		async payOrder() {
			//创建订单
			//组织订单信息
			const orderInfo = {
				order_price: 0.01,
				consignee_addr: this.addstr,
				goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
			};
			//发起请求创建订单
			const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
			console.log(res)
	        //由于token是假的所以此处不能申请支付
			if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！(由于此项目只为演示，所以无法发起)');
			//到服务器响应的“订单编号”
			const orderNumber = res.message.order_number;
			//订单预支付
			//发起请求获取订单的支付信息
			const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber });
			//预付订单生成失败
			if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！');
			//得到订单支付相关的必要参数
			const payInfo = res2.message.pay;
			   //发起微信支付
			   //调用 uni.requestPayment() 发起微信支付
			   const [err, succ] = await uni.requestPayment(payInfo)
			   //未完成支付
			   if (err) return uni.$showMsg('订单未支付！')
			   //完成了支付，进一步查询支付的结果
			   const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
			   // 检测到订单未支付
			   if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
			   //  检测到订单支付完成
			   uni.showToast({
			     title: '支付完成！',
			     icon: 'success'
			   })
		}
	}
};
</script>

<style lang="scss">
.my-settle-container {
	/* 底部固定定位 */
	position: fixed;
	bottom: 0;
	left: 0;
	/* 设置宽高和背景色 */
	width: 100%;
	height: 50px;
	// 将背景色从 cyan 改为 white
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 5px;
	font-size: 14px;
}
.radio {
	display: flex;
	align-items: center;
}

.amount {
	color: #058b8c;
}

.btn-settle {
	height: 50px;
	min-width: 100px;
	background-color: #058b8c;
	color: white;
	line-height: 50px;
	text-align: center;
	padding: 0 10px;
}
</style>
