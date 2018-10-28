<template>
    <v-layout justify-center mt-2>
        <v-flex xs11 sm11>
            <v-card>
                <v-toolbar class="green lighten-1 py-1" dense flat>
                    <v-toolbar-title>Books</v-toolbar-title>
                    <v-text-field
						class="ml-5"
                        flat
						dense
                        label="Search for a book title or the author"
                        append-icon="search"
                        @click:append="search"
                        solo-inverted
						hide-details
						single-line
                        v-model="table.searchValue"
                        @keyup.native.enter="search"
                    ></v-text-field>
					<v-btn icon @click="fillTheTable">
						<v-icon>sync</v-icon>
					</v-btn>
                </v-toolbar>
                <v-card-text>
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
                                :class="{'amber lighten-3': (props.item.listedBy === listedBy)}"
                            >
                                <td>{{ props.item.title }}</td>
                                <td>{{ props.item.author }}</td>
                                <td>{{ props.item.listedByUserName }}</td>
                                <td>{{ props.item.listedAt | formatDate}}</td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card
                                flat
                                :class="{'amber lighten-4': (props.item.listedBy === listedBy)}"
                            >
                                <v-card-text>{{ props.item.info }}</v-card-text>
                                <v-card-actions>
                                    <v-btn 
                                        flat 
                                        class="green lighten-1" 
                                        @click="openModal(props.item)"
                                        v-if="props.item.listedBy!==listedBy"
                                    >Request for trade</v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
                <trade-request-modal ref="trade"></trade-request-modal>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import TradeRequestModal from "../components/TradeRequestModal.vue"
import BookService from "../util/bookservice.js"
import Filter from "../util/filters.js"

export default {
	data() {
		return {
			table: {
				headers: [
					{ text: "Title", value: "title" },
                    { text: "Author", value: "author" },
                    { text: "Listed by", value: "listedByUserName"},
					{ text: "Listed date-time", value: "listedAt"}
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
			}
		};
    },
    methods: {
        fillTheTable() {
            this.table.loading = true
            BookService.get(this.table.pagination, this.table.searchValue)
                .then((data) => {
                    this.table.items = data.data.books
                    this.table.total = data.data.total
                })
                .catch(error => console.log("error getting the data :", error))
                .then(this.table.loading = false)
        },
        search() {
            this.fillTheTable()
        },
        openModal(book) {
			this.$refs.trade.openModal(book)
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
    components: {
        TradeRequestModal
    },
    computed: {
		listedBy() {
			return this.$store.state.user_id
		}
    },
    created() {
        this.$root.$on("booksReload", () => {
            this.fillTheTable()
        })
    },
    destroyed() {
        this.$root.$off("booksReload")
    }
};
</script>
<style lang="sass" scoped>

</style>