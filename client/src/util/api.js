import Axios from "axios"
import Store from "../store.js"

export default () => {
    return Axios.create({
        baseURL: "http://localhost:8000/",
        headers: {
            "Authorization": `Bearer ${Store.state.token}`
        }
    })
}