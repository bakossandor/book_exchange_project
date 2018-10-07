import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: null,
		user: null,
	},
	mutations: {
		authUser(state, authdata) {
			state.token = authdata.token
			state.user = authdata.user
		}
	},
	actions: {
		login({commit}, authdata) {
			commit("authUser", {
				token: authdata.token,
				user: authdata.user
			})
		},
		logout({commit}) {
			commit("authUser", {
				token: null,
				user: null,
			})
		}
	}
})
