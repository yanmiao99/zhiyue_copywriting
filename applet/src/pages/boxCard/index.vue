<template>
	<View class="box_card">
		<nut-cell>
			<View class="box_card_wrapper">
				<View class="box_card_text">这世间所有美好的词汇都当配得上你</View>
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
import { onMounted, ref, defineExpose } from 'vue';
import { View } from '@tarojs/components';
import Taro, { useShareTimeline, useShareAppMessage, useRouter } from '@tarojs/taro';

const shareData = ref({});

const handleShare = () => {
	const id = 1;
	shareData.value = {
		title: '这世间所有美好的词汇都当配得上你',
		path: `/pages/boxCard/index?id=${id}`,
	};
};

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

	// 动态设置标题
	Taro.setNavigationBarTitle({
		title: params.text,
	});
});

const handleCopy = () => {
	Taro.setClipboardData({
		data: '这世间所有美好的词汇都当配得上你',
		success: () => {
			Taro.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000,
			});
		},
	});
};

const handleAgain = () => {
	Taro.showToast({
		title: '再来一条',
		icon: 'success',
		duration: 2000,
	});
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
