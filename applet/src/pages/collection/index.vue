<template>
	<configProvider>
		<View class="collection_wrapper">
			<scroll-view
				refresher-enabled="true"
				style="height: 100vh; overflow-y: auto; overflow-x: hidden"
				:refresherTriggered="refresherTriggered"
				@refresherrefresh="refresh"
				@scrolltolower="lower"
				:scroll-y="true"
			>
				<View class="collection_empty" v-if="!collectionListData.length">
					<nut-empty description="404" />
				</View>
				<View class="collection_content">
					<View
						class="collection_item"
						v-for="(item, index) in collectionListData"
						:key="item.id"
						@click="onCopyText(item.CategoryDetail.text)"
					>
						<View class="collection_item_title">
							{{ item.CategoryDetail.text }}
						</View>
						<View class="collection_item_tag"> 点击复制 </View>
					</View>
				</View>

				<View class="collection_tips">
					<Loading v-if="loading" />
					{{ tipsText }}
				</View>
			</scroll-view>
		</View>
	</configProvider>
</template>

<script setup>
import { View } from '@tarojs/components';
import { ref, onMounted } from 'vue';
import Taro, { useDidShow } from '@tarojs/taro';
import { collectionList } from '@/http/api.js';
import { onCopyText } from '@/utils/index.js';
import { Loading } from '@nutui/icons-vue-taro';

// 每次进入页面都会触发
useDidShow(() => {
	getCollectionList();
});

const collectionListData = ref([]); // 收藏列表
const loading = ref(true); // 是否加载中
const refresherTriggered = ref(false); // 下拉刷新是否触发
const tipsText = ref('没有更多了~');
const pagination = ref({
	page: 1,
	limit: 10,
	totalCount: 0,
});

const getCollectionList = async () => {
	const res = await collectionList({
		page: pagination.value.page,
		limit: pagination.value.limit,
	});
	// console.log('res========', res);

	// 追加数据
	collectionListData.value = [...collectionListData.value, ...res.data.list];
	pagination.value = res.data.pagination;

	// 判断触底加载
	if (
		pagination.value.page * pagination.value.limit >=
		pagination.value.totalCount
	) {
		tipsText.value = '没有更多了~';
		loading.value = false;
	} else {
		tipsText.value = '上拉加载更多';
		loading.value = true;
	}
};

// 下拉刷新的函数
const refresh = () => {
	refresherTriggered.value = true;
	collectionListData.value = [];
	pagination.value.page = 1;
	getCollectionList();
	setTimeout(() => {
		refresherTriggered.value = false;
	}, 1000);
};

// 滚动触底时触发的函数
const lower = (e) => {
	if (collectionListData.value.length < pagination.value.totalCount) {
		loading.value = true;
		tipsText.value = '加载中...';
		pagination.value.page++;
		getCollectionList();
	} else if (collectionListData.value.length === pagination.value.totalCount) {
		loading.value = false;
		tipsText.value = '没有更多了~';
	}
};
</script>

<style lang="less">
.collection_wrapper {
	padding: 20px;
	box-sizing: border-box;
	height: 100%;
	min-height: 100vh;
	background: #f6f8fa;

	.collection_empty {
		margin: 0 auto;
	}

	.collection_content {
		.collection_item {
			padding: 20px;
			margin-bottom: 30px;
			border-radius: 20px;
			position: relative;
			border: 1px solid #f5f5f5;
			padding: 60px 20px 40px 20px;
			box-sizing: border-box;
			background: #fff;

			.collection_item_title {
				font-size: 30px;
				color: #333;
				margin-bottom: 10px;
			}
			.collection_item_tag {
				font-size: 20px;
				color: #d04636;
				background: #feeae7;
				border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
				position: absolute;
				right: 0;
				top: 0;
				padding: 5px 10px;
			}
		}
	}

	.collection_tips {
		padding: 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
	}

	// 禁用滚动条
	::-webkit-scrollbar {
		display: none;
	}
}
</style>
