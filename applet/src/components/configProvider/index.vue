<template>
	<nut-config-provider :theme-vars="themeVars">
		<View class="config_provider_wrapper">
			<slot></slot>
		</View>
	</nut-config-provider>
</template>

<script setup>
import { ref } from 'vue';
const themeVars = ref({
	primaryColor: '#FBDD02',
	buttonPrimaryColor: '#333333',
});
</script>

<style lang="less"></style>
