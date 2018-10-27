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
                :total-items="table.total"
                :rows-per-page-items='[25, 50, 100]'
                :pagination.sync="table.pagination"
            >
                <template slot="items" slot-scope="props">
                    <tr 
                        @click="props.expanded = !props.expanded" 
                        :class="{
                            'amber lighten-1': (props.item.status === 'pending'),
                            'amber lighten-2': (props.item.status === 'approved')
                        }"
                    >
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.author }}</td>
                        <td>{{ props.item.listedAt | formatDate}}</td>
                    </tr>
                </template>
                <template slot="expand" slot-scope="props">
                    <v-card flat 
                        :class="{
                            'amber lighten-3': (props.item.status === 'pending'),
                            'amber lighten-4': (props.item.status === 'approved')

                        }"
                    >
                        <v-card-text>{{ props.item.info }}</v-card-text>
                        <hr>
                        <v-card-text>
                            <h3>Your offer is</h3>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn flat v-if="props.item.status === 'pending'" @click="approveRequest(props.item)">Approve</v-btn>
                            <v-btn flat @click="reportProblem(props.item)">Report problem</v-btn>
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
					{ text: "Listed date-time", value: "listedAt" }
                ],
                items: [],
                loading: false,
                pagination: {
                    descending: true,
                    page: 1,
                    rowsPerPage: 25,
                    sortBy: "listedAt",
                    totalItems: 0,
                },
            },
            counterBooks: []
        }
    },
    methods: {
        fillTheTable() {
            this.table.loading = true
            BookService.getUserBooks(this._id, this.table.pagination, ["pending", "approved"])
                .then((data) => {
                    this.table.items = data.data.books
                    this.table.total = data.data.total
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },
        approveRequest(book) {
            const body = {
                approvedBookId: book._id,
                tradeInfo: book.tradeInfo
            }
            console.log("body :", body)
            BookService.approveRequest(body)
            console.log("approved request :", body)
        },
        reportProblem(book) {
            console.log("report a problem :", book)
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


