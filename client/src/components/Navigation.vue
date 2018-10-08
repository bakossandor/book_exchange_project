<template>
    <div>
        <v-toolbar class="success">
            <v-toolbar-title>Book Trader</v-toolbar-title>
            <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat v-for="(item, inx) in menu" :key="inx" :to="item.link">{{ item.title }}</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-navigation-drawer class="success" v-model="sideNav" absolute temporary>
            <v-list>
                <v-list-tile v-for="item in menu" :key="item.title" :to="item.link">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sideNav: null,
            menu: [
                {icon: "change_history", title: "nav", link: "#"},
                {icon: "change_history", title: "nav2", link: "#"},
                {icon: "change_history", title: "nav3", link: "#"}
            ]
        }
    }
}
</script>

