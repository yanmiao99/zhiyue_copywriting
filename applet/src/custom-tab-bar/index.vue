<template>
	<cover-view class="tab_bar">
		<cover-view class="tab_bar_border"></cover-view>
		<cover-view
			v-for="(item, index) in list"
			:key="index"
			class="tab_bar_item"
			@tap="switchTab(index, item.pagePath)"
		>
			<cover-image
				:src="selected === index ? item.selectedIconPath : item.iconPath"
			/>
			<cover-view
				:style="{ color: selected === index ? selectedColor : color }"
			>
				{{ item.text }}
			</cover-view>
		</cover-view>
	</cover-view>
</template>

<script setup>
import Taro from '@tarojs/taro';
import { ref } from 'vue';
import { useGlobalStore } from '@/store/index';
const store = useGlobalStore();

const selected = ref(store.tabBarSelectedIndex);

const color = ref('#000000');
const selectedColor = ref('#DC143C');
const list = ref([
	{
		pagePath: '/pages/index/index',
		selectedIconPath: require('@/assets/tabbar/home_active.png'),
		iconPath: require('@/assets/tabbar/home.png'),
		text: '首页',
	},
	{
		pagePath: '/pages/my/index',
		selectedIconPath: require('@/assets/tabbar/my_active.png'),
		iconPath: require('@/assets/tabbar/my.png'),
		text: '个人中心',
	},
]);

const switchTab = (index, url) => {
	setSelected(index);
	Taro.switchTab({ url });
};

const setSelected = (index) => {
	store.setTabBarSelectedIndex(index);
};
</script>

<style lang="less">
.tab_bar {
	position: fixed;
	bottom: 5%;
	right: 10%;
	left: 10%;
	background: white;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: env(safe-area-inset-bottom);
	border: 1px solid #f0f0f0;
	border-radius: 50px;
	height: 150px;
	padding: 0;
}

.tab_bar_item {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.tab_bar_item cover-image {
	width: 54px;
	height: 54px;
}

.tab_bar_item cover-view {
	font-size: 20px;
}
</style>
