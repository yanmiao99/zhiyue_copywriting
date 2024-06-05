<template>
	<configProvider>
		<View class="box_card_wrapper">
			<View
				class="box_card_header"
				:style="{ paddingTop: `${headerTitleTop + 10}px` }"
			>
				<View class="box_card_header_title">
					<RectLeft size="20" color="#333" @click="goBackPage" />
					<Text> {{ currentTitle }} </Text>
				</View>
			</View>

			<View class="box_card_banner" :style="{ top: `${navBarHeight + 20}px` }">
				<Image
					class="box_card_banner_img"
					src="https://qny.weizulin.cn/images/202406051432122.png"
					mode="aspectFill"
				/>
				<View class="box_card_banner_time">
					<View class="box_card_banner_time_day" v-cloak>
						{{ dateObj.day }}
					</View>
					<View class="box_card_banner_time_info">
						<View class="box_card_banner_time_year_month" v-cloak>
							{{ dateObj.yearMonth }}
						</View>
						<View class="box_card_banner_time_week" v-cloak>
							{{ dateObj.week }}
						</View>
					</View>
				</View>
			</View>

			<View
				class="box_card_content"
				:style="{ top: `${navBarHeight + 200}px` }"
				v-if="boxDataList.length"
			>
				<nut-swiper
					@change="handleChange"
					pagination-visible
					direction="vertical"
					style="height: 500px"
					pagination-color="#FBDD02"
					:loop="false"
					ref="swiperRef"
					:init-page="swiperInitPage"
				>
					<nut-swiper-item v-for="(item, index) in boxDataList" :key="item.id">
						<View class="box_card_item" style="height: 500px">
							<View class="box_card_item_message">
								<View class="box_card_item_title" v-cloak>{{ item.text }}</View>
							</View>
						</View>
					</nut-swiper-item>

					<nut-swiper-item>
						<View class="box_card_item" v-if="!notMore">
							<View class="box_card_item_message">
								<View class="box_card_item_title text_nowrap">
									小主，今日文案已推送完！
								</View>
								<Text class="box_card_item_desc">
									每日5份文案，如果想要加更，点击下方看广告按钮，可继续推送。
								</Text>
							</View>
							<View class="box_card_item_btn_group">
								<View class="box_card_item_btn" @click="handleNext">
									看广告刷新
								</View>
							</View>
						</View>

						<View class="box_card_item" v-else>
							<View class="box_card_item_message">
								<View class="box_card_item_title text_nowrap">
									小主，没有更多的文案了 ~
								</View>
								<Text class="box_card_item_desc">
									请切换板块查看其他的文案叭
								</Text>
							</View>
							<View class="box_card_item_btn_group">
								<View class="box_card_item_btn" @click="goBackPage">
									返回上一页
								</View>
							</View>
						</View>
					</nut-swiper-item>
				</nut-swiper>

				<nut-space fill justify="end" v-show="btnShow">
					<nut-button
						style="border: none"
						shape="square"
						@click="handleShare"
						openType="share"
					>
						<template #icon>
							<Share />
						</template>
						分享
					</nut-button>
					<nut-button style="border: none" shape="square" @click="handleCopy">
						<template #icon>
							<Follow />
						</template>
						复制
					</nut-button>
				</nut-space>
			</View>
		</View>
	</configProvider>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { View } from '@tarojs/components';
import Taro, {
	useShareTimeline,
	useShareAppMessage,
	useRouter,
} from '@tarojs/taro';
import { categoryDetails, categoryDetailsList } from '@/http/api.js';
import configProvider from '@/components/configProvider/index.vue';
import { RectLeft, Share, Follow } from '@nutui/icons-vue-taro';
import { goBackPage } from '@/utils/index.js';
import dayjs from 'dayjs';

import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { headerTitleTop, navBarHeight } = useGetNavHeight();

const shareData = ref({});

const boxData = ref({}); // 当前数据
const boxDataList = ref([]); // 当前数据列表

const currentPageParams = ref({}); // 当前页面参数

const currentTitle = ref('织月文案'); // 当前标题

const btnShow = ref(true); // 按钮显示

const notMore = ref(false); // 是否没有更多

const dateObj = ref({}); // 日期

// swiper初始化页
const swiperInitPage = ref(0);

// page
const boxDataPage = ref({
	page: 1,
	limit: 2,
	totalCount: 0,
});

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
	handleDetailList(params.pageId);

	dateObj.value = {
		day: dayjs().format('DD'),
		yearMonth: dayjs().format('YYYY年MM月'),
		week: getWeek(),
	};
});

// 获取星期
const getWeek = () => {
	const data = dayjs().day();
	const week = ['日', '一', '二', '三', '四', '五', '六'];
	return '星期' + week[data];
};

const swiperRef = ref(null);

// 查看详情列表
const handleDetailList = async (categoryId, type) => {
	Taro.showLoading({
		title: '加载中...',
	});

	let params = {
		categoryId,
		...boxDataPage.value,
	};

	const res = await categoryDetailsList(params);

	// boxDataList.value = res.data.list;
	boxDataList.value = [...boxDataList.value, ...res.data.list];

	boxData.value = res.data.list[0];

	currentTitle.value = res.data.list[0].categoryTitle;

	const { page, limit, totalCount } = res.data.pagination;

	boxDataPage.value = {
		page,
		limit,
		totalCount,
	};

	if (type === 'add') {
		swiperInitPage.value = res.data.list[0].index;
	}

	Taro.hideLoading();
};

// 分享
const handleShare = () => {
	shareData.value = {
		title: boxData.value.text,
		path: `/pages/boxCard/index?pageId=${boxData.value.categoryId}`,
	};
};

// 复制
const handleCopy = () => {
	Taro.setClipboardData({
		data: boxData.value.text,
		success: () => {
			Taro.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000,
			});
		},
		fail: () => {
			Taro.showToast({
				title: '复制失败',
				icon: 'none',
				duration: 2000,
			});
		},
	});
};

// swiper切换
const handleChange = (index) => {
	const item = boxDataList.value[index];
	boxData.value = item;

	// 判断是否是最后一页
	if (index === boxDataList.value.length) {
		btnShow.value = false;
	} else {
		btnShow.value = true;
	}

	// 判断是否已经没有内容了
	if (
		boxDataPage.value.page * boxDataPage.value.limit >=
		boxDataPage.value.totalCount
	) {
		notMore.value = true;
	} else {
		notMore.value = false;
	}
};

// 下一页
const handleNext = () => {
	// 加载下一页
	if (
		boxDataPage.value.page * boxDataPage.value.limit <
		boxDataPage.value.totalCount
	) {
		boxDataPage.value.page += 1;
		handleDetailList(currentPageParams.value.pageId, 'add');
	} else {
		Taro.showToast({
			title: '没有更多了',
			icon: 'none',
			duration: 2000,
		});
	}
};
</script>

<style lang="less">
[v-cloak] {
	display: none;
}
.box_card_wrapper {
	width: 100%;
	.box_card_header {
		width: 100%;
		height: 800px;
		background: linear-gradient(180deg, #f6ce62, #f0d563, transparent);
		padding-left: 20px;
		box-sizing: border-box;
		color: #333;

		.box_card_header_title {
			display: flex;
			align-items: center;
			font-size: 40px;
		}
	}

	.box_card_banner {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.box_card_banner_img {
			width: 300px;
			height: 300px;
		}
		.box_card_banner_time {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #2e192f;
			.box_card_banner_time_day {
				font-size: 110px;
				font-weight: bold;
			}
			.box_card_banner_time_info {
				padding-left: 20px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: self-start;
				.box_card_banner_time_year_month {
					font-size: 40px;
				}
				.box_card_banner_time_week {
					font-size: 45px;
					font-weight: bold;
				}
			}
		}
	}

	.box_card_content {
		padding: 20px;
		box-sizing: border-box;
		width: 95%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 20px;
		background: #fff;

		.box_card_item {
			padding: 100px 30px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			box-sizing: border-box;
			.box_card_item_message {
				border-radius: 30px;
				padding: 40px;

				.box_card_item_title {
					font-size: 46px;
					padding-bottom: 20px;
					border-bottom: 1px solid #eee;
					margin-bottom: 20px;
				}

				.text_nowrap {
					white-space: nowrap;
				}

				.box_card_item_desc {
					font-size: 32px;
					color: #555;
					line-height: 1.8em;
				}
			}

			.box_card_item_btn_group {
				font-size: 30px;
				.box_card_item_btn {
					width: 400px;
					height: 100px;
					border-radius: 6px;
					background: linear-gradient(180deg, #f6ce62, #f0d563);
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 38px;
					color: #333;
					margin-bottom: 10px;
				}
			}
		}
	}
}
</style>
