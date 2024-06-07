<template>
	<configProvider>
		<View class="login_wrapper">
			<View
				class="login_header"
				:style="{ paddingTop: `${headerTitleTop + 20}px` }"
			>
				<View class="login_header_title">
					<RectLeft size="20" color="#333" @click="goBackPage" />
				</View>
			</View>

			<View class="login_content" :style="{ top: `${navBarHeight + 50}px` }">
				<View class="login_title">
					<Text class="login_title_text">
						邮箱{{ loginType === 'register' ? '注册' : '登录' }}
					</Text>
					<Text class="login_title_sub_text">
						{{
							loginType === 'register'
								? '已注册的邮箱请直接登录'
								: '未注册的邮箱请先点击进行注册'
						}}
					</Text>
				</View>

				<View class="login_form">
					<nut-form
						label-position="top"
						ref="formRef"
						:model-value="formData"
						:rules="{
							username: [
								{ required: loginType === 'register', message: '请填写昵称' },
								{ min: 2, max: 10, message: '昵称长度在 2 到 10 个字符' },
							],
							email: [{ required: true, message: '请填写邮箱' }],
							password: [
								{ required: true, message: '请填写密码' },
								{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符' },
							],
							code: [
								{ required: loginType === 'register', message: '请填写验证码' },
							],
						}"
					>
						<nut-form-item
							label=""
							prop="username"
							v-if="loginType === 'register'"
						>
							<nut-input
								v-model="formData.username"
								placeholder="请输入昵称"
								type="text"
							/>
						</nut-form-item>
						<nut-form-item label="" prop="email">
							<nut-input
								v-model="formData.email"
								placeholder="请输入邮箱"
								type="text"
							/>
						</nut-form-item>
						<nut-form-item label="" prop="password">
							<nut-input
								v-model="formData.password"
								placeholder="请输入密码"
								type="password"
							/>
						</nut-form-item>
						<nut-form-item label="" prop="code" v-if="loginType === 'register'">
							<View class="login_code_border">
								<nut-input
									v-model="formData.code"
									placeholder="请输入验证码"
									type="text"
								>
									<template #right>
										<nut-button
											style="border: none; background: transparent"
											size="small"
											@click="getCodeInfo"
											:loading="isSendCode"
										>
											{{ isSendCode ? `重新获取${codeTimer}` : '获取验证码' }}
										</nut-button>
									</template>
								</nut-input>
							</View>
						</nut-form-item>
					</nut-form>

					<View class="login_btn">
						<nut-button block type="primary" round @click="handleSubmit">
							{{ loginType === 'register' ? '注册' : '登录' }}
						</nut-button>
					</View>

					<View class="login_sub_btn" @click="handleChangeLoginType">
						{{
							loginType === 'register' ? '已有账号，去登录' : '没有账号，去注册'
						}}
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
import { ref, onUnmounted } from 'vue';
import { register, login, getCode } from '@/http/login.js';
import Taro from '@tarojs/taro';

const formData = ref({
	username: '',
	// email: '13680670263@163.com',
	// password: '123123',
	email: '',
	password: '',
	code: '',
	platform: 'applet',
});

const loginType = ref('login'); // 登录类型

const isSendCode = ref(false); // 是否正在发送验证码
const codeTimer = ref(60); // 验证码倒计时
let codeTimeRef = null;

const formRef = ref(null);

const getCodeInfo = async () => {
	// 校验邮箱
	if (!formData.value.email) {
		Taro.showToast({
			title: '请填写邮箱',
			icon: 'none',
		});
		return;
	}

	if (isSendCode.value) return;
	isSendCode.value = true;

	// 开始倒计时
	codeTimeRef = setInterval(() => {
		codeTimer.value--;
		if (codeTimer.value <= 0) {
			clearInterval(codeTimeRef);
			isSendCode.value = false;
			codeTimer.value = 60;
		}
	}, 1000);

	const res = await getCode({ email: formData.value.email });
	Taro.showToast({
		title: res.msg,
		icon: 'none',
	});
};

// 提交表单
const handleSubmit = () => {
	formRef.value?.validate().then(async ({ valid, errors }) => {
		if (valid) {
			console.log('success:', formData.value);
			// 登录或者注册
			const res =
				loginType.value === 'register'
					? await register(formData.value)
					: await login(formData.value);

			if (loginType.value === 'register') {
				Taro.showToast({
					title: '注册成功',
					icon: 'none',
				});
				handleChangeLoginType();
			} else {
				Taro.showToast({
					title: '登录成功',
					icon: 'none',
				});

				// 存储
				Taro.setStorage({
					key: 'token',
					data: res.data.token,
				});

				const pages = Taro.getCurrentPages();
				const current = pages[pages.length - 1];
				const eventChannel = current.getOpenerEventChannel();
				eventChannel.emit('loginSuccess');

				goBackPage();
			}
		} else {
			console.warn('error:', errors);
		}
	});
};

// 切换登录或者注册
const handleChangeLoginType = () => {
	loginType.value = loginType.value === 'register' ? 'login' : 'register';
};

// 页面卸载
onUnmounted(() => {
	clearInterval(codeTimeRef);
});
</script>

<style lang="less">
.login_wrapper {
	width: 100%;
	height: 100vh;
	background: #fff;
	.login_header {
		width: 100%;
		height: 1000px;
		// background: linear-gradient(180deg, #f6ce62, #f0d563, transparent);
		padding-left: 20px;
		box-sizing: border-box;
		color: #333;

		.login_header_title {
			display: flex;
			align-items: center;
			font-size: 40px;
		}
	}

	.login_content {
		width: 100%;
		position: absolute;
		padding: 20px;
		box-sizing: border-box;
		.login_title {
			color: #333;
			display: flex;
			flex-direction: column;
			padding: 0 20px;
			box-sizing: border-box;

			.login_title_text {
				font-size: 60px;
				margin-bottom: 20px;
				font-weight: bold;
			}
			.login_title_sub_text {
				font-size: 30px;
			}
		}

		.login_form {
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

		.login_btn {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;
			.nut-button {
				border-radius: 50px !important;
				padding: 20px !important;
			}
		}

		.login_sub_btn {
			padding-top: 50px;
			width: 100%;
			color: #333;
			text-align: center;
		}
	}
}
</style>
