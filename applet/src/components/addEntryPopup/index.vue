<template>
	<configProvider>
		<nut-form
			ref="formRef"
			:model-value="formData"
			:rules="{
				categoryId: [{ required: true, message: '请选择分类' }],
				text: [{ required: true, message: '请输入内容' }],
			}"
		>
			<nut-form-item label="分类" prop="categoryId">
				<nut-input
					:model-value="String(currentCategory?.text || '请选择分类')"
					readonly
					@click="handleSelectCategory"
				/>

				<nut-popup v-model:visible="categoryShow" position="bottom">
					<nut-picker
						v-model="formData.categoryId"
						:columns="columns"
						title="分类选择"
						@confirm="onConfirm"
						@cancel="() => (categoryShow = false)"
					/>
				</nut-popup>
			</nut-form-item>

			<nut-form-item label="内容" prop="text">
				<textarea
					v-model="formData.text"
					placeholder="请输入内容"
					showCount
					style="width: 100%; color: #333"
				/>
			</nut-form-item>

			<View style="margin: 10px">
				<nut-button block type="primary" @click="submit">提交</nut-button>
				<nut-button style="margin-top: 10px" block @click="reset">
					重置
				</nut-button>
			</View>
		</nut-form>
	</configProvider>
</template>

<script setup>
import Taro from '@tarojs/taro';
import { ref, onMounted } from 'vue';
import { categoryList, categoryDetailsAdd } from '@/http/api.js';
import configProvider from '@/components/configProvider/index.vue';

const emit = defineEmits(['close']);

const formRef = ref(null);

const formData = ref({
	text: '',
	categoryId: [],
});

const categoryShow = ref(false);
const currentCategory = ref([]);

onMounted(() => {
	getCategoryList();
});

// 选择分类
const handleSelectCategory = () => {
	getCategoryList();
	categoryShow.value = true;
};

const columns = ref([]);

// 获取分类列表
const getCategoryList = async () => {
	const res = await categoryList();
	const { data } = res;
	const tempData = data.list.map((item) => {
		return {
			text: item.text,
			value: item.id,
		};
	});
	columns.value = tempData;
};

// 选择分类
const onConfirm = ({ selectedValue, selectedOptions }) => {
	console.log(selectedValue[0], selectedOptions[0]);
	categoryShow.value = false;
	currentCategory.value = selectedOptions[0];
};

// 重置
const reset = () => {
	formData.value = {
		text: '',
		categoryId: '',
	};
	formRef.value?.reset();
};

// 提交
const submit = () => {
	formRef.value?.validate().then(async ({ valid, errors }) => {
		if (valid) {
			console.log('success:', formData.value);

			let params = {
				text: formData.value.text,
				categoryId: formData.value.categoryId[0],
			};

			// 提交数据
			await categoryDetailsAdd(params);
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
