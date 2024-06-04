<template>
	<configProvider>
		<nut-form
			ref="formRef"
			:model-value="formData"
			:rules="{
				text: [{ required: true, message: '请填写内容' }],
				icon: [{ required: true, message: '请上传图标' }],
			}"
		>
			<nut-form-item label="内容" prop="text">
				<nut-input
					v-model="formData.text"
					placeholder="请输入内容"
					type="text"
				/>
			</nut-form-item>

			<nut-form-item label="图标" prop="icon">
				<nut-uploader
					:before-xhr-upload="beforeXhrUpload"
					v-model:file-list="formData.fileList"
					url="https://api.zwzj66.com/api/getPicUrl"
					accept="image/*"
					maximum="1"
				/>
			</nut-form-item>

			<View style="margin: 10px">
				<nut-button block type="primary" @click="submit">提交</nut-button>
				<nut-button style="margin-top: 10px" block @click="reset"
					>重置</nut-button
				>
			</View>
		</nut-form>
	</configProvider>
</template>

<script setup>
import Taro from '@tarojs/taro';
import { ref, defineEmits } from 'vue';
import { categoryAdd } from '@/http/api.js';
import configProvider from '@/components/configProvider/index.vue';

const emit = defineEmits(['close']);

const formRef = ref(null);

const formData = ref({
	text: '',
	icon: '',
	fileList: [],
});

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
				formData.value.icon = data.data.img_url;
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

// 重置
const reset = () => {
	formData.value = {
		text: '',
		icon: '',
		fileList: [],
	};
	formRef.value?.reset();
};

const submit = () => {
	formRef.value?.validate().then(async ({ valid, errors }) => {
		if (valid) {
			console.log('success:', formData.value);

			// 提交数据
			await categoryAdd(formData.value);
			Taro.showToast({
				title: '提交成功',
				icon: 'success',
			});
			reset();
			emit('close');
		} else {
			console.warn('error:', errors);
		}
	});
};
</script>

<style></style>
