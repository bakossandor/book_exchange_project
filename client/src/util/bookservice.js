import Api from "./api"

export default {
    add (info) {
        return Api().post("/api/add", info)
    },
    remove (info) {
        return Api().post("/api/remove", info)
    },
    edit (info) {
        return Api().post("/api/edit", info)
    },
}