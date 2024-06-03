<template>
	<View class="grid_wrapper">
		<nut-grid square border>
			<nut-grid-item @click="handleBoxClick(item)" :text="item.text" v-for="(item, index) in boxList" :key="index">
				<Image class="grid_item_icon" :src="item.icon" mode="aspectFill" lazy-load />
			</nut-grid-item>
		</nut-grid>
	</View>
</template>

<script setup>
import { View, Image } from '@tarojs/components';
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const boxList = ref([
	{
		id: 1,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031022801.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 2,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 3,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 4,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 5,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 6,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 7,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
	{
		id: 8,
		text: '测试文本',
		icon: 'https://qny.weizulin.cn/images/202406031006296.png',
		path: '/pages/boxCard/index',
	},
]);

const handleBoxClick = (item) => {
	Taro.navigateTo({
		url: `${item.path}?pageId=${item.id}&text=${item.text}`,
	});
};
</script>

<style lang="less">
.grid_wrapper {
	padding: 20px;
	box-sizing: border-box;

	.grid_item_icon {
		width: 80px;
		height: 80px;
	}
}
</style>
