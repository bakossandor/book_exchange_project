<template>
    <div>
        <div>
            <h2>My trade board</h2>
        </div>
        <div>
            <h3>I have offered for</h3>
            <v-data-table
                :headers="table.headers"
                :items="table.items"
                item-key="_id"
                :loading="table.loading"
                hide-actions
            >
                <template slot="items" slot-scope="props">
                    <tr 
                        @click="props.expanded = !props.expanded" 
                        :class="{'amber lighten-1': (props.item.tradeStatus === 'offered')}"
                    >
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.author }}</td>
                        <td>{{ props.item.listedByUserName }}</td>
                        <td>{{ props.item.listedAt | formatDate}}</td>
                    </tr>
                </template>
                <template slot="expand" slot-scope="props">
                    <v-card flat :class="{'amber lighten-4': (props.item.tradeStatus === 'offered')}">
                        <v-card-text>{{ props.item.info }}</v-card-text>
                        <hr>
                        <v-card-text>
                            <h3>Your offer is</h3>
                            <p><strong>Title:</strong> {{getTitle(props.item.traderBookId)}}, || <strong>Author:</strong> {{getAuthor(props.item.traderBookId)}}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn flat @click="declineRequest(props.item)">Decline</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-data-table>
        </div>        
    </div>
</template>
<script>
import BookService from "../util/bookservice.js"
import Filter from "../util/filters.js"
export default {
    data() {
        return {
            table: {
                headers: [
                    { text: "Title", value: "title" },
                    { text: "Author", value: "author" },
                    { text: "Listed by", value: "listedByUserName" },
					{ text: "Listed date-time", value: "listedAt" }
                ],
                items: [],
                loading: false,
            },
            counterBooks: []
        }
    },
    methods: {
        fillTheTable() {
            this.table.loading = true
            BookService.getTradeBooks(this._id)
                .then((data) => {
                    this.table.items = data.data.books
                    this.counterBooks = data.data.counterBook
                    console.log("this tradeBooks :", this.table.items)
                    console.log("counterBooks :", data.data.counterBook)
                    console.log("this tradeBooks :", data)
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },
        declineRequest(book) {
            const books = {
                offered_id: book._id,
                offered_userId: book.listedBy,
                requested_id: book.traderBookId,
                requested_userId: book.traderUserId
            }
            console.log(books)
            BookService.declineRequest(books)
        },
        getAuthor(id) {
            return this.counterBooks.filter(book => book._id === id)[0].author
        },
        getTitle(id) {
            return this.counterBooks.filter(book => book._id === id)[0].title
        }
    },
    filters: {
        formatDate: Filter.formatDate
    },
    mounted() {
        this.fillTheTable()
    },
    computed: {
		_id() {
			return this.$store.state.user_id
        },
        userEmail() {
			return this.$store.state.email
		},
	}
}
</script>


