import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"

import RouteGuard from "./util/route-guard"

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/register',
			name: 'register',
			component: Register,
			beforeEnter: RouteGuard.ifLoggedOut,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			beforeEnter: RouteGuard.ifLoggedOut,
		},
		{
			path: '/books',
			name: 'books',
			beforeEnter: RouteGuard.ifAuthenticated,
			component: () => import(/* webpackChunkName: "books" */ './views/Books.vue')
		},
		{
			path: '/mybooks',
			name: 'mybooks',
			beforeEnter: RouteGuard.ifAuthenticated,
			component: () => import(/* webpackChunkName: "mybooks" */ './views/MyBooks.vue')
		}
	]
})
