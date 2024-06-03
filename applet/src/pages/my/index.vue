<template>
	<View class="my_wrapper">
		<nut-cell-group title="新建内容">
			<nut-cell title="新建分类" is-link @click="handleChangeCategory(true)" />
			<nut-cell title="新建词条" is-link @click="handleNewEntry" />
		</nut-cell-group>

		<nut-popup v-model:visible="newCategoryPopup" position="bottom" closeable round>
			<View class="popup_wrapper">
				<View class="popup_title">新增分类</View>
				<View class="popup_content">
					<addCategoryPopup @close="handleChangeCategory(false)" />
				</View>
			</View>
		</nut-popup>
	</View>
</template>

<script setup>
import { View } from '@tarojs/components';
import { ref } from 'vue';
import addCategoryPopup from '@/components/addCategoryPopup/index.vue';

const newCategoryPopup = ref(false);
const handleChangeCategory = (status) => {
	newCategoryPopup.value = status;
};

const newEntryPopup = ref(false);
const handleNewEntry = () => {
	newCategoryPopup.value = true;
};
</script>

<style lang="less">
.my_wrapper {
	padding: 20px;
	box-sizing: border-box;
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
