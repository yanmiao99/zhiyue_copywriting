import Taro from '@tarojs/taro';

// 返回上一页
export const goBackPage = () => {
	// 判断是否有上一页 , 如果没有, 则回到首页
	if (Taro.getCurrentPages().length === 1) {
		Taro.switchTab({
			url: '/pages/index/index',
		});
	} else {
		Taro.navigateBack();
	}
};
