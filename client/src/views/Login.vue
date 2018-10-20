<template>
    <v-container fill-height>
        <v-layout justify-center row wrap align-center>
            <v-flex xs11 sm6>
                <v-card class="elevation-2">
                    <v-toolbar class="success">
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field 
                                v-model="email" 
                                label="email"
                                color="green lighten-1" 
                                prepend-icon="email"
                                type="text"
                            ></v-text-field>
                            
                            <v-text-field
                                    color="green lighten-1" 
                                    prepend-icon="lock" 
                                    name="password" 
                                    label="Password" 
                                    type="password" 
                                    v-model="password"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn 
                                color="success"  
                                class="black--text" 
                                @click.prevent="login"
                            >Login</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
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
                const {email, id, userName, exp} = JWT_decode.decode(token)
                Localstorage.setLocalStorage(token, email, id, userName, exp)
                this.$store.dispatch("login", {token, email, id, userName})
                this.$router.push({name: "mybooks"})
            } catch (error) {
                console.log("error in the login: ", error)
            }
        }
    }
}
</script>
<style lang="sass" scoped>
</style>

