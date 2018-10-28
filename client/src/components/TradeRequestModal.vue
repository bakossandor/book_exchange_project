<template>
	<v-layout row justify-center>
		<v-dialog v-model="dialog" persistent>
            <v-toolbar class="success">
                <v-toolbar-title>The requested book</v-toolbar-title>
            </v-toolbar>
			<v-card>
				
				<v-card-text>
					<div>
                        <h3>The requested book</h3>
                        <p>Title: {{requestedBook.title}}</p>
                        <p>Author: {{requestedBook.author}}</p>
                        <p>This book is listed by <strong>{{requestedBook.listedByUserName}}</strong></p>
                    </div>
                    <div>
                        <h3>What is your offer?</h3>
                        <v-data-table
                            :headers="table.headers"
                            :items="table.items"
                            item-key="_id"
                            :loading="table.loading"
                            :total-items="table.total"
                            :rows-per-page-items='[25, 50, 100]'
                            :pagination.sync="table.pagination"
                        >
                            <template slot="items" slot-scope="props">
                                <tr @click="selectBook(props.item)">
                                    <td>{{ props.item.title }}</td>
                                    <td>{{ props.item.author }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>
                    <div v-if="selectedBooks.length > 0">
                        <h3>Offered books</h3>
                        <div v-for="(book, idx) in selectedBooks" :key="idx">
                            <span><strong>Title:</strong> {{book.title}}</span> ||
                            <span><strong>Author:</strong> {{book.author}}</span>
                            <v-icon class="ml-2" @click="selectedBooks.splice(idx, 1)">delete</v-icon>
                        </div>
                    </div>
				</v-card-text>
				<v-card-actions>
					<v-btn 
						color="green darken-1" 
						flat 
						@click.native="tradeRequest"
                        :disabled="selectedBooks.length === 0"
					>Trade</v-btn>
					
					<v-btn 
						color="green darken-1" 
						flat 
						@click.native="dialog=false"
					>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>
<script>
import BookService from "../util/bookservice.js"

export default {
	data() {
		return {
			valid: "",
			dialog: false,
            requestedBook: "",
            table: {
                headers: [
                    { text: "Title", value: "title" },
					{ text: "Author", value: "author" },
                ],
                items: [],
                total: 0,
                loading: false,
                pagination: {
                    descending: true,
                    page: 1,
                    rowsPerPage: 25,
                    sortBy: "title",
                    totalItems: 0,
                },
                searchValue: null,
            },
            selectedBooks: []
		}
	},
	methods: {
		openModal(requestedBook) {
            this.dialog = true
            this.requestedBook = requestedBook
            
        },
        fillTheTable() {
            this.table.loading = true
            BookService.getUserBooks(this._id, this.table.pagination, "listed")
                .then((data) => {
                    this.table.items = data.data.books
                    this.table.total = data.data.total
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },
        selectBook(book) {
            this.selectedBooks.length = 0
            this.selectedBooks.push(book)
        },
        tradeRequest() {
            
            const updatedInfo = {
                //which book I offer to the trade
                initiaterBook: this.selectedBooks[0]._id,
                initiater: this._id,
                // I want this book
                receiverBook: this.requestedBook._id,
                receiver: this.requestedBook.listedBy,
            }
            console.log("books :", updatedInfo)
            BookService.tradeRequest(updatedInfo)
                .then(() => {
                    this.$root.$emit("booksReload")
                    this.dialog = false
                })
        }
	},
    mounted() {
        this.fillTheTable()
    },
    watch: {
        "table.pagination": {
            handler() {
                this.fillTheTable()
            },
            deep: true
        }
    },
    computed: {
		_id() {
			return this.$store.state.user_id
        },
        userName() {
			return this.$store.state.userName
		},
    },
}
</script>
