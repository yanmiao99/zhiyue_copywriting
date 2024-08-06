export default defineAppConfig({
	pages: [
		'pages/index/index',
		'pages/boxCard/index',
		'pages/my/index',
		'pages/login/index',
		'pages/updateUserInfo/index',
		'pages/collection/index',
	],
	tabBar: {
		custom: true,
		color: '#383838',
		selectedColor: '#333',
		backgroundColor: '#fff',
		borderStyle: 'white',
		list: [
			{
				pagePath: 'pages/index/index',
				text: '文案',
				iconPath: 'assets/tabbar/home.png',
				selectedIconPath: 'assets/tabbar/home_active.png',
			},
			{
				pagePath: 'pages/my/index',
				text: '我的',
				iconPath: 'assets/tabbar/my.png',
				selectedIconPath: 'assets/tabbar/my_active.png',
			},
		],
	},
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: 'WeChat',
		navigationBarTextStyle: 'black',
	},
});
