<template>
	<View class="nav_custom_bar" :style="{ paddingTop: `${headerTitleTop}px` }">
		<View
			class="nav_custom_bar_back"
			:class="{ hidden: !backIcon }"
			@click="goBackPage"
		>
			<RectLeft size="18" :color="textColor" />
		</View>
		<Text class="nav_custom_bar_title">
			{{ title }}
		</Text>
		<View></View>
	</View>
</template>

<script setup>
import { View, Text } from '@tarojs/components';
import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { navBarHeight, headerTitleTop } = useGetNavHeight();
import { goBackPage } from '@/utils/index.js';
import { RectLeft } from '@nutui/icons-vue-taro';

import { onMounted, ref } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '标题',
	},
	bgColor: {
		type: String,
		default: null,
	},
	backIcon: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String,
		default: '#333',
	},
});

const currentBg = ref();

onMounted(() => {
	if (props.bgColor) {
		currentBg.value = props.bgColor;
	} else {
		currentBg.value = 'linear-gradient(180deg, #D0FC51, transparent)';
	}
});
</script>

<style lang="less">
.nav_custom_bar {
	width: 100%;
	height: 70vh;
	background: v-bind(currentBg);
	padding-left: 20px;
	box-sizing: border-box;
	display: flex;
	color: #333;

	.nav_custom_bar_back {
		margin-top: 30px;
		margin-right: 10px;
		&.hidden {
			display: none;
		}
	}
	.nav_custom_bar_title {
		font-size: 40px;
		font-family:
			Microsoft YaHei,
			Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		margin-top: 20px;
	}
}
</style>
