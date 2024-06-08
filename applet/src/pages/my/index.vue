<template>
	<configProvider>
		<View class="my_wrapper">
			<View class="my_content" :style="{ top: `${navBarHeight}px` }">
				<View class="my_user_box" @click="handleLogin">
					<View class="my_user_avatar">
						<Image
							class="my_user_avatar_img"
							:src="
								currentInfo?.avatar ||
								'https://qny.weizulin.cn/images/202406031006296.png'
							"
						/>
					</View>

					<View class="my_user_info">
						<View class="my_user_name">
							{{ currentInfo.username || '用户登录/注册' }}
						</View>

						<View class="my_user_desc">
							{{ currentInfo.fromToday || '登录体验更多功能' }}
						</View>
					</View>

					<View class="my_user_setting" v-if="currentInfo.username">
						<Setting color="#333" size="16" />
					</View>
				</View>

				<!-- <nut-cell-group title="新建">
					<nut-cell
						title="新建分类"
						is-link
						@click="handleChangeCategory(true)"
					/>
					<nut-cell title="新建词条" is-link @click="handleNewEntry(true)" />
				</nut-cell-group> -->

				<nut-cell-group title="账号">
					<nut-cell title="退出登录" is-link @click="handleOutUser()" />
				</nut-cell-group>

				<nut-popup
					v-model:visible="newCategoryPopup"
					position="bottom"
					closeable
					round
				>
					<View class="popup_wrapper">
						<View class="popup_title">新增分类</View>
						<View class="popup_content">
							<addCategoryPopup @close="handleChangeCategory(false)" />
						</View>
					</View>
				</nut-popup>

				<nut-popup
					v-model:visible="newEntryPopup"
					position="bottom"
					closeable
					round
				>
					<View class="popup_wrapper">
						<View class="popup_title">新增词条</View>
						<View class="popup_content">
							<addEntryPopup @close="handleNewEntry(false)" />
						</View>
					</View>
				</nut-popup>
			</View>
		</View>
	</configProvider>
</template>

<script setup>
import { View } from '@tarojs/components';
import { ref, onMounted } from 'vue';
import addCategoryPopup from '@/components/addCategoryPopup/index.vue';
import addEntryPopup from '@/components/addEntryPopup/index.vue';
import configProvider from '@/components/configProvider/index.vue';
import Taro, { useDidShow } from '@tarojs/taro';
import { getUserInfo } from '@/http/login.js';
import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { navBarHeight } = useGetNavHeight();
import dayjs from 'dayjs';
import { Setting } from '@nutui/icons-vue-taro';

// 每次进入页面都会触发
onMounted(() => {
	getCurrentUserInfo();
});

useDidShow(() => {});

const currentInfo = ref({}); // 当前用户信息

// 获取当前用户信息
const getCurrentUserInfo = async () => {
	const res = await getUserInfo();
	currentInfo.value = res.data;
	const today = dayjs().format('YYYY-MM-DD');
	// 计算 距离创建时间到今天是多少天
	const fromToday = dayjs(today).diff(dayjs(res.data.createdAt), 'day');
	currentInfo.value.fromToday = '织月文案已经陪伴你' + fromToday + '天了 ~ ';
};

// 新增分类
const newCategoryPopup = ref(false);
const handleChangeCategory = (status) => {
	newCategoryPopup.value = status;
};

// 新增词条
const newEntryPopup = ref(false);
const handleNewEntry = (status) => {
	newEntryPopup.value = status;
};

// 登录
const handleLogin = () => {
	// 判断是否已经登录
	const token = Taro.getStorageSync('token');

	Taro.navigateTo({
		url: token ? '/pages/updateUserInfo/index' : '/pages/login/index',
		events: {
			// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
			loginSuccess: function (data) {},
			updateSuccess: function (data) {},
		},
		success: function (res) {
			res.eventChannel.on('loginSuccess', function (data) {
				// 获取登录成功后的用户信息
				getCurrentUserInfo();
			});
			res.eventChannel.on('updateSuccess', function (data) {
				// 获取登录成功后的用户信息
				getCurrentUserInfo();
			});
		},
	});
};

// 退出登录
const handleOutUser = () => {
	const token = Taro.getStorageSync('token');
	if (!token) {
		Taro.showToast({
			title: '您还未登录',
			icon: 'none',
		});
		return;
	}

	Taro.showModal({
		title: '提示',
		content: '确定退出登录吗？',
		success: function (res) {
			if (res.confirm) {
				Taro.removeStorageSync('token');
				currentInfo.value = {};
				Taro.showToast({
					title: '退出成功',
					icon: 'success',
				});
			}
		},
	});
};
</script>

<style lang="less">
.my_wrapper {
	.my_header {
		width: 100%;
		height: 1000px;
		background: linear-gradient(180deg, #f6ce62, #f0d563, transparent);
		padding-left: 20px;
		box-sizing: border-box;
		color: #333;

		.my_header_title {
			display: flex;
			align-items: center;
			font-size: 40px;
		}
	}

	.my_content {
		padding: 20px;
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		.my_user_box {
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 50px;
			border-radius: 10px;

			.my_user_avatar {
				width: 150px;
				height: 150px;
				border-radius: 20px;
				overflow: hidden;
				.my_user_avatar_img {
					width: 100%;
					height: 100%;
				}
			}

			.my_user_info {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-around;
				margin-left: 20px;
				color: #333;
				height: 150px;
				.my_user_name {
					font-size: 40px;
				}
				.my_user_desc {
					font-size: 30px;
				}
			}

			.my_user_setting {
				margin-left: auto;
				margin-right: 30px;
			}
		}
	}

	.popup_wrapper {
		padding: 20px;
		box-sizing: border-box;
		.popup_title {
			font-size: 30px;
			margin-bottom: 40px;
			margin-top: 10px;
			text-align: center;
		}
	}
}
</style>
