<template>
	<View class="box_card">
		<nut-cell>
			<View class="box_card_wrapper">
				<View class="box_card_text">{{ boxData.text }}</View>
			</View>
		</nut-cell>
		<nut-space fill justify="end">
			<nut-button shape="square" type="primary" @click="handleShare" openType="share">分享</nut-button>
			<nut-button shape="square" type="primary" @click="handleCopy">复制</nut-button>
			<nut-button shape="square" type="primary" @click="handleAgain">再来一条</nut-button>
		</nut-space>
	</View>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { View } from '@tarojs/components';
import Taro, { useShareTimeline, useShareAppMessage, useRouter } from '@tarojs/taro';
import { categoryDetails } from '@/http/api.js';

const shareData = ref({});

const boxData = ref({}); // 当前数据

const currentPageParams = ref({}); // 当前页面参数

// 转发
useShareAppMessage((res) => {
	if (res.from === 'button') {
		return { ...shareData.value };
	}
	return {
		title: '织月文案',
		path: '/pages/boxCard/index',
		imageUrl: 'https://qny.weizulin.cn/images/202406031022801.png',
	};
});

onMounted(() => {
	const params = useRouter().params;

	currentPageParams.value = params;

	let id = params.id || null;

	handleDetail(params.pageId, id);
});

// 查看详情
const handleDetail = async (categoryId, id = null) => {
	let params = {
		categoryId,
		id,
	};
	const res = await categoryDetails(params);
	console.log('res========', res);
	boxData.value = res.data;

	// 动态设置标题
	Taro.setNavigationBarTitle({
		title: res.data.categoryTitle,
	});
};

// 分享
const handleShare = () => {
	shareData.value = {
		title: boxData.text,
		path: `/pages/boxCard/index?pageId=${boxData.categoryId}&id=${boxData.id}`,
	};
};

// 复制
const handleCopy = () => {
	Taro.setClipboardData({
		data: boxData.text,
		success: () => {
			Taro.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000,
			});
		},
	});
};

// 请求接口
const handleAgain = () => {
	const params = currentPageParams.value;
	handleDetail(params.pageId);
};
</script>

<style lang="less">
.box_card {
	padding: 20px;
	box-sizing: border-box;

	.box_card_wrapper {
		min-height: 300px;
	}

	.box_card_text {
		display: inline;
		color: #666;
		border-bottom: 1px solid #666;
	}
}
</style>
