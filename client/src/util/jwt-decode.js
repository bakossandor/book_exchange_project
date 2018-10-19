import jwt_decode from "jwt-decode"

export default {
    decode(token) {
        try {
            return jwt_decode(token)
        } catch (error) {
            console.log("error decoding the auth token :", error)
        }
    }
}