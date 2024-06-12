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

// 复制文字
export const onCopyText = (text) => {
	if (!text) {
		Taro.showToast({
			title: '复制内容不能为空',
			icon: 'none',
			duration: 2000,
		});
		return;
	}
	Taro.setClipboardData({
		data: text,
		success: () => {
			Taro.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000,
			});
		},
		fail: () => {
			Taro.showToast({
				title: '复制失败',
				icon: 'none',
				duration: 2000,
			});
		},
	});
};
