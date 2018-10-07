<template>
    <div>
        <v-layout>
            <v-form v-model="valid">
                <v-text-field v-model="email" label="email"></v-text-field>
                <v-text-field type="password" v-model="password" label="password"></v-text-field>
            </v-form>
            <v-btn @click="register">register</v-btn>
        </v-layout> 
    </div>
</template>
<script>
import Authservice from "../util/authservice.js"
export default {
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    },
    methods: {
        async register() {
            try {
                await Authservice.register({
                    email: this.email,
                    password: this.password
                })
            } catch (error) {
                this.error = error.response.data.error
            }
        }
    }
}
</script>
<style lang="sass" scoped>
.error
    color: orange
</style>

