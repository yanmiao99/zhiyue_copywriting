<template>
	<configProvider>
		<View class="update_wrapper">
			<View
				class="update_header"
				:style="{ paddingTop: `${headerTitleTop + 20}px` }"
			>
				<View class="update_header_title">
					<RectLeft size="20" color="#333" @click="goBackPage" />
					<Text>更新个人信息</Text>
				</View>
			</View>

			<View class="update_content" :style="{ top: `${navBarHeight}px` }">
				<View class="update_form">
					<nut-form
						ref="formRef"
						:model-value="formData"
						:rules="{
							username: [
								{ required: true, message: '请填写昵称' },
								{ min: 2, max: 10, message: '昵称长度在 2 到 10 个字符' },
							],
							avatar: [{ required: true, message: '请上传头像' }],
						}"
					>
						<nut-form-item label="ID" prop="id">
							<nut-input
								v-model="formData.id"
								type="text"
								disabled
								@click="handleDisabledTips"
							/>
						</nut-form-item>
						<nut-form-item label="邮箱" prop="email">
							<nut-input
								v-model="formData.email"
								placeholder="请输入邮箱"
								type="text"
								disabled
								@click="handleDisabledTips"
							/>
						</nut-form-item>
						<nut-form-item label="昵称" prop="username">
							<nut-input
								v-model="formData.username"
								placeholder="请输入昵称"
								type="text"
							/>
						</nut-form-item>
						<nut-form-item label="头像" prop="avatar">
							<nut-uploader
								:before-xhr-upload="beforeXhrUpload"
								v-model:file-list="formData.fileList"
								url="https://api.zwzj66.com/api/getPicUrl"
								accept="image/*"
								maximum="1"
							/>
						</nut-form-item>
					</nut-form>

					<View class="update_btn">
						<nut-button block type="primary" round @click="handleSubmit">
							提交
						</nut-button>
					</View>
				</View>
			</View>
		</View>
	</configProvider>
</template>

<script setup>
import configProvider from '@/components/configProvider/index.vue';
import { useGetNavHeight } from '@/hooks/useGetNavHeight.js';
const { headerTitleTop, navBarHeight } = useGetNavHeight();
import { RectLeft } from '@nutui/icons-vue-taro';
import { goBackPage } from '@/utils/index.js';
import { ref, onUnmounted, onMounted } from 'vue';
import { register } from '@/http/login.js';
import Taro from '@tarojs/taro';
import { getUserInfo, updateUserInfo } from '@/http/login.js';

const formData = ref({
	username: '',
	email: '',
	avatar: '',
	fileList: [],
});

onMounted(() => {
	getCurrentUserInfo();
});

// 获取当前用户信息
const getCurrentUserInfo = async () => {
	const res = await getUserInfo();
	formData.value = res.data;
	formData.value.fileList = [
		{
			name: '用户头像.png',
			url:
				res.data.avatar || 'https://qny.weizulin.cn/images/202406112051793.png',
			status: 'success',
			message: '上传成功',
			type: 'image',
		},
	];
};

const formRef = ref(null);

// 自定义上传
const beforeXhrUpload = (taroUploadFile, options) => {
	const uploadTask = taroUploadFile({
		url: options.url,
		filePath: options.taroFilePath,
		fileType: options.fileType,
		header: {
			'Content-Type': 'multipart/form-data',
			...options.headers,
		},
		formData: options.formData,
		name: options.name,
		success(response) {
			if (options.xhrState == response.statusCode) {
				options.onSuccess?.(response, options);
			} else {
				options.onFailure?.(response, options);
			}

			const data = JSON.parse(response.data);
			console.log('data========', data);
			if (data.code === 200) {
				Taro.showToast({
					title: '上传成功',
					icon: 'success',
				});
				formData.value.avatar = data.data.img_url;
			} else {
				Taro.showToast({
					title: '上传失败',
					icon: 'none',
				});
			}
		},
		fail(e) {
			options.onFailure?.(e, options);
		},
	});
	options.onStart?.(options);
	uploadTask.progress((res) => {
		options.onProgress?.(res, options);
		// console.log('上传进度', res.progress);
		// console.log('已经上传的数据长度', res.totalBytesSent);
		// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
	});
	// uploadTask.abort(); // 取消上传任务
};

// 禁用提示
const handleDisabledTips = () => {
	Taro.showToast({
		title: '该字段不可编辑',
		icon: 'none',
	});
};

// 提交表单
const handleSubmit = () => {
	formRef.value?.validate().then(async ({ valid, errors }) => {
		if (valid) {
			console.log('success:', formData.value);

			let params = {
				username: formData.value.username,
				avatar: formData.value.fileList[0].url,
			};

			const res = await updateUserInfo(params);

			Taro.showToast({
				title: res.msg,
				icon: 'none',
			});

			const pages = Taro.getCurrentPages();
			const current = pages[pages.length - 1];
			const eventChannel = current.getOpenerEventChannel();
			eventChannel.emit('updateSuccess');

			goBackPage();
		} else {
			console.warn('error:', errors);
		}
	});
};
</script>

<style lang="less">
.update_wrapper {
	width: 100%;
	height: 100vh;
	background: #fff;
	.update_header {
		width: 100%;
		height: 1000px;
		padding-left: 20px;
		box-sizing: border-box;
		color: #333;

		.update_header_title {
			display: flex;
			align-items: center;
			font-size: 40px;
		}
	}

	.update_content {
		width: 100%;
		position: absolute;
		padding: 20px;
		box-sizing: border-box;

		.update_form {
			margin-top: 50px;
		}
		.nut-cell-group__wrap {
			background-color: transparent !important;
			box-shadow: none !important;
		}
		.nut-cell-group .nut-cell::after {
			border-color: transparent !important;
		}
		.nut-cell {
			position: relative;
			background-color: #f9f9f9 !important;
			padding: 50px;
			overflow: visible !important;
			border-radius: 20px;
			margin-bottom: 20px;
			input {
				font-size: 30px;
				color: #333;
			}
			.input-placeholder {
				color: #333;
			}
		}
		.nut-input__text--readonly {
			background: red !important;
		}

		.update_btn {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			.nut-button {
				border-radius: 50px !important;
				padding: 20px !important;
			}
		}
	}
}
</style>
