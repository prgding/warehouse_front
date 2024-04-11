/**
 * 路由定义
 */


const routes = [

	// 访问路由"/", 自动重定向到"/home"
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import('@/views/home.vue'),
		children: [
			// // 首页
			// {
			// 	path: '', // 默认路径
			// 	name: 'index',
			// 	component: () => import('@/views/index/index.vue')
			// },
			// 用户列表
			{
				path: '/user/index',
				name: 'userList',
				component: () => import('@/views/user/index.vue'),
				meta: {nav: ['用户管理']}
			},
			// 商品列表
			{
				path: '/commodity/index',
				name: 'commodityList',
				component: () => import('@/views/commodity/index/index.vue'),
				meta: {nav: ['商品管理', '商品列表']}
			},
			// 商品分类
			{
				path: '/commodity/category',
				name: 'commodityCategory',
				component: () => import('@/views/commodity/category/index.vue'),
				meta: {nav: ['商品管理', '商品分类管理']}
			},
			// 商品品牌
			{
				path: '/commodity/brand',
				name: 'commodityBrand',
				component: () => import('@/views/commodity/brand/index.vue'),
				meta: {nav: ['商品管理', '商品品牌管理']}
			},
			// 入库列表
			{
				path: '/in-warehouse/index',
				name: 'inWarehouseList',
				component: () => import('@/views/in-warehouse/index.vue'),
				meta: {nav: ['入库管理', '入库列表']}
			},
			// 出库列表
			{
				path: '/out-warehouse/index',
				name: 'outWarehouseList',
				component: () => import('@/views/out-warehouse/index.vue'),
				meta: {nav: ['出库管理', '出库列表']}
			},
			// 统计报表
			{
				path: '/statistics/index',
				name: 'statisticsReport',
				component: () => import('@/views/statistics/charts/index.vue'),
				meta: {nav: ['统计管理', '统计报表']}
			},
			// 仓库列表
			{
				path: '/warehouse/index',
				name: 'warehouseList',
				component: () => import('@/views/warehouse/index.vue'),
				meta: {nav: ['仓库管理', '仓库列表']}
			},
			// 单位设置
			{
				path: '/system/unit',
				name: 'unitList',
				component: () => import('@/views/system/unit/index.vue'),
				meta: {nav: ['系统设置', '单位列表']}
			},
		]
	},
	{
		path: '/login',
		name: "Login",
		component: () => import('@/views/login.vue')
	},
	{
		path: '/404',
		name: "NotFound",
		component: () => import('@/views/404.vue')
	},


];

// 判断路由是否存在
const existsRoute_inner = (path, theRoutes) => {
	for (let i = 0; i < theRoutes.length; i++) {
		const r = theRoutes[i];
		if (r.path !== path) {
			if (r.children && r.children.length) {
				const existsInChildren = existsRoute_inner(path, r.children);
				if (existsInChildren) return true;
			}
		} else {
			return true;
		}
	}
	return false;
};

export const existsRoute = (path) => {

	return existsRoute_inner(path, routes);

};

export default routes;