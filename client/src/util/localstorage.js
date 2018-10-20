export default {
    setLocalStorage(token, email, id, userName, exp) {
        localStorage.setItem("token", JSON.stringify({token, email, id, userName, exp: new Date(exp * 1000)}))
    },
    removeLocalStorage() {
        localStorage.removeItem("token");
    },
    askToken() {
        return JSON.parse(localStorage.getItem("token"))
    }
}