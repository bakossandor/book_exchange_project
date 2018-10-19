import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: null,
		email: null,
		user_id: null
	},
	mutations: {
		authUser(state, authdata) {
			state.token = authdata.token
			state.email = authdata.email
			state.user_id = authdata.id
		}
	},
	actions: {
		login({commit}, authdata) {
			commit("authUser", {
				token: authdata.token,
				email: authdata.email,
				id: authdata.id
			})
		},
		logout({commit}) {
			commit("authUser", {
				token: null,
				email: null,
				id: null
			})
		}
	}
})
