<template>
    <div>
        <div>
            <h2>My archived books</h2>
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
                <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.title }}</td>
                    <td>{{ props.item.author }}</td>
                    <td>{{ props.item.listedBy }}</td>
                    <td>{{ props.item.listedAt | formatDate}}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <v-card-text>{{ props.item.info }}</v-card-text>
                    <v-card-actions>
                        <v-btn flat class="green lighten-1">Edit</v-btn>
                        <v-btn flat class="green lighten-1" @click="activate(props.item._id)">Activate</v-btn>
                        <v-btn flat class="green lighten-1" @click="remove(props.item._id)">Delete</v-btn>
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
                    { text: "Listed by", value: "listBy" },
                    { text: "Listed date-time", value: "listedDT" }
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
            }
        }
    },
    methods: {
        fillTheTable() {
            this.table.loading = true
            BookService.getUserBooks(this._id, this.table.pagination, "archived")
                .then((data) => {
                    this.table.items = data.data.books
                    this.table.total = data.data.total
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },

        activate(id) {
            BookService.status(id, {status: "listed"})
        },
        remove(id) {
            BookService.remove(id)
        }
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
		}
	}
}
</script>
