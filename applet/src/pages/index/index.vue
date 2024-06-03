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
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import { categoryList } from '@/http/api.js';

const boxList = ref([]);

onMounted(() => {
	getCategoryList();
});

const getCategoryList = async () => {
	const res = await categoryList();
	const { data } = res;
	const tempData = data.map((item) => {
		return {
			...item,
			path: '/pages/boxCard/index',
		};
	});
	boxList.value = tempData;
};

const handleBoxClick = (item) => {
	Taro.navigateTo({
		url: `${item.path}?pageId=${item.id}`,
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
