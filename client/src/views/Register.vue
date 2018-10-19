<template>
    <v-container fill-height>
        <v-layout justify-center row wrap align-center>
            <v-flex xs11 sm6>
                <v-card class="elevation-2">
                    <v-toolbar class="success">
                        <v-toolbar-title>Register</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form v-model="valid">
                            <v-text-field 
                                color="green lighten-1" 
                                prepend-icon="email" 
                                name="register" 
                                label="Email" 
                                type="text" 
                                v-model="email"
                                :rules="[rules.required, rules.email]"
                            ></v-text-field>

                            <v-text-field 
                                color="green lighten-1" 
                                prepend-icon="face" 
                                name="user" 
                                label="Username" 
                                type="text" 
                                v-model="userName"
                                :rules="[rules.required]"
                            ></v-text-field>

                            <v-text-field
                                color="green lighten-1" 
                                prepend-icon="lock" 
                                name="password" 
                                label="Password" 
                                type="password" 
                                v-model="password"
                                :rules="[rules.required, rules.password]"
                            ></v-text-field>

                            <v-text-field 
                                color="green lighten-1" 
                                prepend-icon="lock" 
                                name="confirm-password" 
                                label="Confirm Password" 
                                type="password" 
                                v-model="confirmPassword" 
                                :rules="[comparePasswords, rules.required]"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn 
                                color="success" 
                                :disabled=!valid 
                                class="black--text" 
                                @click.prevent="register"
                                :loading="loading"
                            >Register</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>

                <v-alert
                    :value="error"
                    color="error"
                    icon="warning"
                    outline
                >{{ error }}</v-alert>

            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Authservice from "../util/authservice.js";
export default {
    data() {
        return {
            valid: "",
            email: "",
            userName: "",
            password: "",
            confirmPassword: "",
            error: false,
            loading: false,
            rules: {
                required: value => !!value || "Required.",
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || "Invalid e-mail."
                },
                password: value => {
                    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                    return pattern.test(value) || "Min 8 character - one upper case - one lower case - one number"
                }
            }  
        };
    },
    computed: {
        comparePasswords() {
            return this.password !== this.confirmPassword ? "Passwords do not match" : true
        },
    },
    methods: {
        async register() {
            this.loading = true
            try {
                const registered = await Authservice.register({
                    email: this.email,
                    password: this.password,
                    userName: this.userName
                });
                if (registered.status === 201) {
                    this.$router.push({name: "login"})
                }
            } catch (error) {
                this.error = error.response.data.error;
                this.loading = false
            }
        }
    },
};
</script>
<style lang="sass" scoped>

</style>

