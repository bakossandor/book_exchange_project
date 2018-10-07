import jwt_decode from "jwt-decode"

export default {
    decode(token) {
        return jwt_decode(token)
    }
}