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

// 获取分类详情列表
export const categoryDetailsList = (data) => {
	return request({
		url: '/categoryDetails/detailsList',
		data,
		method: 'GET',
	});
};

// 新增分类详情
export const categoryDetailsAdd = (data) => {
	return request({
		url: '/categoryDetails/add',
		data,
		method: 'POST',
	});
};
