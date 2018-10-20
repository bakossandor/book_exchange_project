<template>
    <div>
        <v-layout>
            <v-form>
                <v-text-field v-model="email" label="email"></v-text-field>
                <v-text-field type="password" v-model="password" label="password"></v-text-field>
            </v-form>
            <v-btn @click="login">Login</v-btn>
        </v-layout> 
    </div>
</template>
<script>
import Authservice from "../util/authservice.js"
import JWT_decode from "../util/jwt-decode.js"
import Localstorage from "../util/localstorage.js"
export default {
    data() {
        return {
            email: "",
            password: ""
        }
    },
    methods: {
        async login() {
            try {
                const loginResponse = await Authservice.login({
                    email: this.email,
                    password: this.password
                })
                const token = loginResponse.headers.authorization.split(" ")[1]
                const {email, id, userName} = JWT_decode.decode(token)
                Localstorage.setLocalStorage(token)
                this.$store.dispatch("login", {
                    token,
                    email,
                    id,
                    userName
                })
            } catch (error) {
                console.log("error in the login: ", error)
            }
        }
    }
}
</script>
<style lang="sass" scoped>
</style>

