<template>
	<View class="nav_custom_bar" :style="{ height: `${navBarHeight}px` }">
		<View
			class="nav_custom_bar_back"
			:class="{ hidden: !needBackIcon }"
			@click="goBackPage"
		>
			<RectLeft size="16" :color="textColor" />
		</View>
		<Text class="nav_custom_bar_title">
			{{ title }}
		</Text>
		<View></View>
	</View>
</template>

<script setup>
import { RectLeft } from '@nutui/icons-vue-taro';
import { View, Text } from '@tarojs/components';
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
import { goBackPage } from '@/utils/index.js';

const { navBarHeight } = useGetNavHeight();

const props = defineProps({
	title: {
		type: String,
		default: '标题',
	},
	needBackIcon: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String,
		default: '#333',
	},
	bgColor: {
		type: String,
		default: 'linear-gradient(90deg, #ffa15b, #ff7954)',
	},
});
</script>

<style lang="less">
.nav_custom_bar {
	width: 100%;
	background: v-bind(bgColor);
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
	position: relative;
	flex-shrink: 0;
	.nav_custom_bar_back {
		position: absolute;
		left: 22px;
		bottom: 20px;
		&.hidden {
			display: none;
		}
	}
	.nav_custom_bar_title {
		font-size: 50px;
		font-family:
			Microsoft YaHei,
			Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		margin-bottom: 20px;
	}
}
</style>
