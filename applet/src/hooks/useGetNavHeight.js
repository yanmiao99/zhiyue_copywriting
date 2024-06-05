import Taro from '@tarojs/taro';
import { onMounted, ref } from 'vue';

// 获取导航栏高度
export const useGetNavHeight = () => {
	const navBarHeight = ref(0);
	const headerTitleTop = ref(0);

	onMounted(() => {
		let menuButtonObject = Taro.getMenuButtonBoundingClientRect();
		let sysinfo = Taro.getSystemInfoSync();
		let statusBarHeight = sysinfo.statusBarHeight;
		let menuBottonHeight = menuButtonObject.height;
		let menuBottonTop = menuButtonObject.top;

		// 导航栏高度
		let tempNavBarHeight =
			statusBarHeight +
			menuBottonHeight +
			(menuBottonTop - statusBarHeight) * 2;
		navBarHeight.value = tempNavBarHeight;

		// 标题高度
		headerTitleTop.value = menuBottonTop + menuBottonHeight - statusBarHeight;
	});

	return {
		navBarHeight,
		headerTitleTop,
	};
};
