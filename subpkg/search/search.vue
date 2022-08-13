<template>
	<view class="search-box">
		<uni-search-bar @input="input" :radius="100" cancelButton="none" v-model="kw" class="search-bar"></uni-search-bar>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length!==0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{ item.goods_name }}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 列表区域 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<hr/>
				<uni-icons type="trash" size="17" @click="cleanList"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list"><uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="pushitem(item)"></uni-tag></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: true,
			showSync: true,
			searchVal: '',
			// 延时器的 timerId
			timer: null,
			// 搜索关键词
			kw: '',
			//搜索结果列表,用于存储搜索的记录
			searchResults: [],
			//搜索历史记录
			historyList: []
		};
	},
	onLoad(){
		//onload时去加载本地存储的历史记录，如果没有就为空
		this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]')
	},
	methods: {
		input(res) {
			//清除timer对应的延时器
			clearTimeout(this.timer);
			//重启一个延时器，并把timerid赋值给this.timer
			this.timer = setTimeout(() => {
				this.kw = res;
				// 根据关键词，查询搜索建议列表
				this.getSearchList();
			}, 500);
		},
		//根据关键词，搜索商品建议列表
		async getSearchList() {
			// 判断关键词是否为空
			if (this.kw === '') {
				this.searchResults = [];
				return;
			}
			// 发起请求，获取搜索建议列表
			const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw });
			if (res.meta.status !== 200) return uni.$showMsg();
			this.searchResults = res.message;
			this.saveSearchHistory()
		},
		gotoDetail(goods_id) {
			uni.navigateTo({
				url: '/subpkg//subpkg/goods_detail/goods_detail?goods_id=' + goods_id
			});
		},
		saveSearchHistory(){
			//把搜索关键词push进historyList数组中，限制长度20以内
			if (this.historyList.length < 20) {
				//将Array转换为Set对象
				const set = new Set(this.historyList)
				//调用set对象的delete方法，移除对应的元素
				set.delete(this.kw)
				//调用add方法，添加对应的元素
				set.add(this.kw)
				//将set对象转化为数组
				this.historyList = Array.from(set)
				//将关键词永久保存在localstorage中
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			}
		},
		//点击关键词将item与kw绑定
		pushitem(item){
			this.kw=item
		},
		//清空历史关键词
		cleanList(){
			this.historyList=[]
			uni.setStorageSync('kw','[]')
		}
	},
	computed:{
		historys(){
			//展开数组后反转
			return[...this.historyList].reverse()
		}
	}
};
</script>

<style lang="scss">
.uni-searchbar {
	display: flex;
	flex-direction: row;
	position: relative;
	padding: 16rpx;
	background-color: #058b8c;
}
// 搜索框吸顶
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
	  border: none;
	  background: none;
	  color: black;
	  font-size: 28rpx;
    }
  }
}
</style>
