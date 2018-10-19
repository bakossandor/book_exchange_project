import Api from "./api"

export default {
    add (info) {
        return Api().post("/api/book", info)
    },
    remove (info) {
        return Api().delete("/api/book", info)
    },
    get (params, searchValue) {
        return Api().get("/api/book", {
            params: {
                query: params,
                searchValue: searchValue
            }
        })
    },
    status(id, info) {
        return Api().put(`/api/book/${id}`, info)
    }
    // edit (info) {
    //     return Api().post("/api/edit", info)
    // },
}