<template>
	<View class="gradient_header" :style="{ paddingTop: `${headerTitleTop}px` }">
		<Text class="gradient_header_title">{{ title }}</Text>
		<Text class="gradient_header_slogan">{{ subTitle }}</Text>
	</View>
</template>

<script setup>
import { View, Text } from '@tarojs/components';
import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { navBarHeight, headerTitleTop } = useGetNavHeight();

import { onMounted, ref } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '标题',
	},
	subTitle: {
		type: String,
		default: '副标题',
	},
	bgColor: {
		type: String,
		default: null,
	},
});

const currentBg = ref();

onMounted(() => {
	if (props.bgColor) {
		currentBg.value = props.bgColor;
	} else {
		// currentBg.value = url('@/assets/images/gradient_bg.png');
		currentBg.value = "url('@/assets/images/gradient_bg.png')";
	}
});
</script>

<style lang="less">
.gradient_header {
	width: 100%;
	height: 800px;
	// background: linear-gradient(180deg, #f6ce62, #f0d563, transparent);
	// background: url('@/assets/images/gradient_bg.png') no-repeat;
	background: v-bind(currentBg);
	padding-left: 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	color: #333;

	.gradient_header_title {
		font-size: 40px;
		font-weight: bold;
	}

	.gradient_header_slogan {
		font-size: 26px;
	}
}
</style>
