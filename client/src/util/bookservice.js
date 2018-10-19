import Api from "./api"

export default {
    add (info) {
        return Api().post("/api/book", info)
    },
    remove (info) {
        return Api().delete("/api/book", info)
    },
    get (params) {
        return Api().get("/api/book", {params: params})
    }
    // edit (info) {
    //     return Api().post("/api/edit", info)
    // },
}