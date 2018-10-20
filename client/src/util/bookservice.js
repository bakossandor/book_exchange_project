import Api from "./api"

export default {
    add (info) {
        return Api().post("/api/book", info)
    },
    remove (id) {
        return Api().delete(`/api/book/${id}`)
    },
    get (params, searchValue) {
        return Api().get("/api/book", {
            params: {
                query: params,
                searchValue: searchValue
            }
        })
    },

    getUserBooks(id, params, status) {
        return Api().get(`/api/user/${id}/book`, {
            params: {
                query: params,
                status: status
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