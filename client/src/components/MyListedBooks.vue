<template>
    <div>
        <div>
            <h2>My listed books</h2>
        </div>
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
                <tr 
                    @click="props.expanded = !props.expanded" 
                    :class="{
                        'amber lighten-1': (props.item.status === 'sacrifice'),
                        'purple lighten-4':(props.item.status === 'thinking')
                    }">
                    <td>{{ props.item.title }}</td>
                    <td>{{ props.item.author }}</td>
                    <td>{{ props.item.listedAt | formatDate}}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-card 
                    flat 
                    :class="{
                        'amber lighten-4': (props.item.status === 'sacrifice'), 
                        'purple lighten-5':(props.item.status === 'thinking')
                    }">
                    <v-card-text>{{ props.item.info }}</v-card-text>
                    <v-card-text v-if="props.item.status === 'sacrifice'">This book is under trade request, It was offered to trade by You</v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!props.item.status" flat class="green lighten-1">Edit</v-btn>
                        <v-btn v-if="!props.item.status" flat class="green lighten-1" @click="archive(props.item._id)">Archive</v-btn>
                        <v-btn v-if="props.item.status === 'sacrifice'" flat class="amber lighten-1" @click="declineRequest(props.item)">Withdraw</v-btn>
                        <v-btn v-if="props.item.status === 'thinking'" flat class="purple lighten-4" @click="acceptRequest(props.item)">Accept</v-btn>
                        <v-btn v-if="props.item.status === 'thinking'" flat class="purple lighten-4" @click="declineRequest(props.item)">Decline</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-data-table>
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
					{ text: "Listed date-time", value: "listedAt" }
                ],
                items: [],
                total: 0,
                loading: false,
                pagination: {
                    descending: true,
                    page: 1,
                    rowsPerPage: 25,
                    sortBy: "listedAt",
                    totalItems: 0,
                },
                searchValue: null,
                colors: {
                    offered: "red"
                }
            }
        }
    },
    methods: {
        fillTheTable() {
            this.table.loading = true
            BookService.getUserBooks(this._id, this.table.pagination, ["listed", "sacrifice", "thinking"])
                .then((data) => {
                    this.table.items = data.data.books
                    this.table.total = data.data.total
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },

        archive(id) {
            BookService.status(id, {status: "archived"})
        },
        acceptRequest(book) {
            const books = {
                offered_id: book._id,
                offered_userId: book.listedBy,
                requested_id: book.traderBookId,
                requested_userId: book.traderUserId
            }
            console.log(books)
            BookService.acceptRequest(books)
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
    },
    filters: {
        formatDate: Filter.formatDate
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
        offered() {
            return "purple"
        },
        userEmail() {
			return this.$store.state.email
		},
	}
}
</script>
