<template>
    <v-container fill-height>
        <v-layout justify-center row wrap align-center>
            <v-flex xs11 sm6 >
                <v-card class="elevation-2">
                    <v-toolbar class="success">
                        <v-toolbar-title>Register</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field 
                                color="green lighten-1" 
                                prepend-icon="person" 
                                name="register" 
                                label="Register" 
                                type="text" 
                                v-model="email"
                                :rules="[rules.required, rules.email]"
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
                            <v-btn color="success" class="black--text" @click.prevent="register">Login</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Authservice from "../util/authservice.js";
export default {
    data() {
        return {
            valid: false,
            email: "",
            password: "",
            confirmPassword: "",
            error: null,
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
            try {
                await Authservice.register({
                    email: this.email,
                    password: this.password
                });
            } catch (error) {
                this.error = error.response.data.error;
            }
        }
    }
};
</script>
<style lang="sass" scoped>

</style>

