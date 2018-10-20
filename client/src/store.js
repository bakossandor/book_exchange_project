import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: null,
		email: null,
		userName: null,
		user_id: null
	},
	mutations: {
		authUser(state, authdata) {
			state.token = authdata.token
			state.email = authdata.email
			state.userName = authdata.userName
			state.user_id = authdata.id
		}
	},
	actions: {
		login({commit}, authdata) {
			commit("authUser", {
				token: authdata.token,
				email: authdata.email,
				userName: authdata.userName,
				id: authdata.id,				
			})
		},
		logout({commit}) {
			commit("authUser", {
				token: null,
				email: null,
				userName: null,
				id: null
			})
		}
	},
	getters: {
        isAuthenticated(state) {
            return state.token !== null
		},
		getUserName(state) {
			return state.userName
		}
    }
})
