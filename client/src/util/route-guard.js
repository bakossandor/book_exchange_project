import store from "../store"

export default {
    ifAuthenticated (to, from, next) {
        if (store.getters.isAuthenticated) {
            next()
            return
        }
        next('/login')
    }
}