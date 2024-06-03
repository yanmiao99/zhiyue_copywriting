import request from '../service/request';

// 添加分类
export const categoryAdd = (data) => {
	return request({
		url: '/category/add',
		data,
		method: 'POST',
	});
};

// 删除分类
export const categoryDelete = (data) => {
	return request({
		url: '/category/delete',
		data,
		method: 'POST',
	});
};

// 查询分类列表
export const categoryList = () => {
	return request({
		url: '/category/list',
		method: 'GET',
	});
};

// 更新分类
export const categoryUpdate = (data) => {
	return request({
		url: '/category/update',
		data,
		method: 'POST',
	});
};

// 获取分类详情
export const categoryDetails = (data) => {
	return request({
		url: '/categoryDetails/first',
		data,
		method: 'GET',
	});
};
