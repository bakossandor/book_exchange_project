<template>
    <div>
        <v-toolbar class="success">
            <v-toolbar-title>Book Trader</v-toolbar-title>
            <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn 
                    flat v-for="(item, inx) in menu" 
                    :key="inx" 
                    :to="item.link"
                >{{ item.title }}</v-btn>
                <v-btn flat to="/books" v-if="auth">Books</v-btn>
                <v-btn flat to="/mybooks" v-if="auth">My Books</v-btn>
                <v-btn flat to="/user" v-if="auth">Profile</v-btn>
                <v-btn flat v-if="auth" @click="logout">Log out</v-btn>
                <v-btn flat to="/register" v-if="!auth">Register</v-btn>
                <v-btn flat to="/login" v-if="!auth">Login</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-navigation-drawer class="green lighten-1" v-model="sideNav" absolute temporary>
            <v-list>
                <v-list-tile
                    v-for="item in menu" 
                    :key="item.title" 
                    :to="item.link"
                    active-class="white--text success"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/books" v-if="auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>library_books</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Books</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/mybooks" v-if="auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>book</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>My books</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/user" v-if="auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>face</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>{{ userName }}</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="logout" v-if="auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Log out</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/register" v-if="!auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>plus_one</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Register</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/login" v-if="!auth" active-class="white--text success">
                    <v-list-tile-action><v-icon>launch</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import Localstorage from "../util/localstorage.js"
export default {
    data() {
        return {
            sideNav: null,
            menu: [
                {icon: "home", title: "home", link: "/"},
                {icon: "info", title: "about", link: "/about"}
            ]
        }
    },
    methods: {
        logout() {
            Localstorage.removeLocalStorage()
            this.$store.dispatch("logout")
            this.$router.push({name: "home"})
        }
    },
    computed: {
        auth() {
			return this.$store.getters.isAuthenticated
        },
        userName() {
            return this.$store.getters.getUserName
        }
    },
}
</script>

