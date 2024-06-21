<template>
	<configProvider>
		<View class="index_wrapper">
			<gradientHeader title="织月文案" subTitle="用心诉说，用字传情" />

			<View class="index_content" :style="{ top: `${navBarHeight}px` }">
				<View class="index_barrage">
					<nut-barrage ref="barrageRef" :danmu="barrageList" />
				</View>

				<View class="index_box">
					<nut-grid :gutter="10">
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
			</View>
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
import gradientHeader from '@/components/gradientHeader/index.vue';

import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { navBarHeight, headerTitleTop } = useGetNavHeight();

const boxList = ref([]);

onMounted(() => {
	getCategoryList();
});

// 刷新
const handleRefresh = () => {
	getCategoryList();
};

const barrageRef = ref();
const barrageList = ref([
	'画美不看画美不看',
	'不明觉厉',
	'喜大普奔',
	'男默女泪',
	'累觉不爱',
	'爷青结-',
]);

const getCategoryList = async () => {
	const res = await categoryList();
	const { data } = res;
	const tempData = data.list.map((item) => {
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
.index_wrapper {
	width: 100%;
	position: relative;

	.index_content {
		width: 100%;
		position: absolute;

		.index_barrage {
			height: 300px;
			.nut-barrage__item {
				width: auto;
				background: linear-gradient(
					to right,
					rgba(255, 255, 255, 0.5),
					rgba(255, 255, 255, 0)
				);
				line-height: 3em;
			}
		}

		.index_box {
			padding: 20px;
			box-sizing: border-box;

			.nut-grid-item__content {
				background: transparent;
				border: transparent;
			}

			.grid_item_icon {
				width: 80px;
				height: 80px;
				border-radius: 20px;
				background: rgba(255, 255, 255, 0.5);
				padding: 20px;
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
	}
}
</style>
