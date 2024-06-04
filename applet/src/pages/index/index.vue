<template>
	<configProvider>
		<View class="grid_wrapper">
			<nut-grid square border>
				<nut-grid-item
					@click="handleBoxClick(item)"
					:text="item.text"
					v-for="(item, index) in boxList"
					:key="index"
				>
					<Image
						class="grid_item_icon"
						:src="item.icon"
						mode="aspectFill"
						lazy-load
					/>
				</nut-grid-item>
			</nut-grid>
		</View>

		<View class="refresh" @click="handleRefresh">
			<nut-button class="refresh_btn" type="primary">
				<template #icon>
					<Refresh2 class="refresh_icon" />
				</template>
			</nut-button>
		</View>
	</configProvider>
</template>

<script setup>
import { View, Image } from '@tarojs/components';
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import { categoryList } from '@/http/api.js';
import configProvider from '@/components/configProvider/index.vue';
import { Refresh2 } from '@nutui/icons-vue-taro';

const boxList = ref([]);

onMounted(() => {
	getCategoryList();
});

const handleRefresh = () => {
	getCategoryList();
};

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

.refresh {
	position: fixed;
	bottom: 20px;
	right: 20px;
	.refresh_btn {
		border-radius: 20px !important;
		width: 40px !important;
		height: 70px !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
	}

	// 按钮点击的时候 refresh_icon 旋转
	.refresh_icon {
		transition: all 0.5s;
	}

	.refresh_btn:hover .refresh_icon {
		transform: rotate(360deg);
	}
}
</style>
