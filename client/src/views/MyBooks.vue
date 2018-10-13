<template>
    <v-layout justify-center mt-2>
        <v-flex xs11 sm11>
            <v-card>
                <v-toolbar class="green lighten-1 py-1" dense flat tabs>
                    <v-toolbar-title>My books</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="openModal">
						<v-icon>fiber_new</v-icon>
					</v-btn>
					<v-tabs
						v-model="tabs"
						color="green lighten-1"
						slider-color="green darken-4"
						slot="extension"
        				left
					>
						<v-tab>Available</v-tab>
						<v-tab>Archived</v-tab>						
					</v-tabs>
                </v-toolbar>

                <v-card-text>
					<v-tabs-items v-model="tabs">
						<v-tab-item>
							<my-listed-books></my-listed-books>
						</v-tab-item>
						<v-tab-item>
							<my-archived-books></my-archived-books>
						</v-tab-item>
					</v-tabs-items>
                </v-card-text>
            </v-card>
			<list-new-book ref="newBook"></list-new-book>
        </v-flex>
    </v-layout>
</template>
<script>
import MyListedBooks from "../components/MyListedBooks.vue"
import MyArchivedBooks from "../components/MyArchivedBooks.vue"
import ListNewBook from "../components/ListNewBookModal.vue"

export default {
	data() {
		return {
			tabs: null,
			
		};
	},
	components: {
		MyListedBooks,
		MyArchivedBooks,
		ListNewBook
	},
	methods: {
		openModal() {
			this.$refs.newBook.openModal()
		}
	}
};
</script>
<style lang="sass" scoped>

</style>

