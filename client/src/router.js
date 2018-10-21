import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from "./views/About.vue"
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
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/register',
			name: 'register',
			component: Register
		},
		{
			path: '/login',
			name: 'login',
			component: Login
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
