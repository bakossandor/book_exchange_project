export default {
    setLocalStorage(token) {
        localStorage.setItem("token", token)
    },
    removeLocalStorage() {
        localStorage.removeItem("token");
    },
    askLocalStorage() {
        
    }
}