import request from '../service/request';

// 注册
export const register = (data) => {
	return request({
		url: '/user/register',
		data,
		method: 'POST',
	});
};

// 登录
export const login = (data) => {
	return request({
		url: '/user/login',
		data,
		method: 'POST',
	});
};

// 获取验证码
export const getCode = (data) => {
	return request({
		url: '/user/getCode',
		data,
		method: 'GET',
	});
};

// 获取当前用户信息
export const getUserInfo = (data) => {
	return request({
		url: '/user/current',
		data,
		method: 'GET',
	});
};

// 更新用户信息
export const updateUserInfo = (data) => {
	return request({
		url: '/user/updateUserInfo',
		data,
		method: 'POST',
	});
};
