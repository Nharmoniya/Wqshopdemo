<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, i) in goodList" :key="i" @click="gotoDetail(item)">
				<!-- 使用mygoods组件 -->
				<mygoods :goods="item"></mygoods>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			//请求参数
			queryObj: {
				//关键词
				query: '',
				//商品分了ID
				cid: '',
				//页码值
				pagenum: 1,
				//每页显示条数
				pagesize: 10
			},
			//商品列表信息
			goodList: [],
			//总数量
			total: 0,
			//“定义节流阀” 是否正在请求数据
			isLoading: false
		};
	},
	onLoad(options) {
		//将页面参数转存到this.queryObj对象中
		this.queryObj.query = options.query || '';
		this.queryObj.cid = options.cid || '';
		//调用getgoodlist方法
		this.getGoodList();
	},
	methods: {
		async getGoodList(cb) {
			//打开节流阀
			this.isLoading = true;
			const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
			//只要数据请求完毕，就立即按需调用cb回调函数
			if (res.meta.status !== 200) return uni.$showMsg();
			//关闭节流阀
			this.isLoading = false;
			cb && cb();
			//为数据赋值，通过展开操作符的形式，进行新旧数据的拼接
			this.goodList = [...this.goodList, ...res.message.goods];
			this.total = res.message.total;
		},
		gotoDetail(item){
			uni.navigateTo({
				url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id,
			});
			uni.setNavigationBarTitle({
				title:'商品详情'
			})
		}
	},
	//触底事件
	onReachBottom() {
		//判断是否还有下一页数据
		if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
			return uni.$showMsg('数据加载完毕!');
		}
		//根据节流阀状态来请求数据
		if (this.isLoading) return;
		//让页面值自增+1
		this.queryObj.pagenum += 1;
		//重新获取列表数据
		this.getGoodList();
	},
	//下拉刷新事件
	onPullDownRefresh() {
		//重置数据
		this.queryObj.pagenum = 1;
		this.total = 0;
		this.isLoading = false;
		this.goodList = [];
		//发起请求
		this.getGoodList()
		//重新发起请求
		setTimeout(()=>{
			uni.stopPullDownRefresh()
		},1000)
	}
};
</script>

<style lang="scss"></style>
