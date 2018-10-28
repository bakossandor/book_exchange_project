import store from "../store"

export default {
    ifAuthenticated (to, from, next) {
        if (store.getters.isAuthenticated) {
            next()
            return
        }
        next('/login')
    },
    ifLoggedOut (to, from, next) {
        const localObj = JSON.parse(localStorage.getItem("token"))
        if (localObj) {
            if (new Date(localObj.exp) >= new Date()) {
                console.log("dispatch login")
                store.dispatch("login", 
                    {
                        token: localObj.token,
                        email: localObj.email,
                        userName: localObj.userName,
                        id: localObj.id
                    }
                )
            }
        }
        if (!store.getters.isAuthenticated) {
            next()
            return
        }
        next('/')
    }
}