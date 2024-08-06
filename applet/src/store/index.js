import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
	state: () => {
		return {
			tabBarSelectedIndex: 0, // 默认选中的 tabbar
		};
	},
	actions: {
		setTabBarSelectedIndex(index) {
			this.tabBarSelectedIndex = index;
		},
	},
});
