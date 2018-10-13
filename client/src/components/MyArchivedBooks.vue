<template>
    <div>
        <div>
            <h2>My archived books</h2>
        </div>
        <v-data-table
            :headers="table.headers"
            :items="table.items"
            item-key="_id"
        >
            <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.title }}</td>
                    <td>{{ props.item.author }}</td>
                    <td>{{ props.item.listBy }}</td>
                    <td>{{ props.item.location }}</td>
                    <td>{{ props.item.listedDT }}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <v-card-text>{{ props.item.info }}</v-card-text>
                    <v-card-actions>
                        <v-btn flat class="green lighten-1">Edit</v-btn>
                        <v-btn flat class="green lighten-1">Activate</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-data-table>
    </div>
    
</template>
<script>
export default {
    data() {
        return {
            table: {
                headers: [
                    { text: "Title", value: "title" },
                    { text: "Author", value: "author" },
                    { text: "Listed by", value: "listBy" },
                    { text: "Listed location", value: "location" },
                    { text: "Listed date-time", value: "listedDT" }
                ],
                items: [
                    {
                        title: "Book 1",
                        author: "Book 1 Author",
                        listBy: "Book 1 owner",
                        location: "Book 1 city",
                        listedDT: "Book 1 listed date-time",
                        info: "a new book",
                        _id: "0001"
                    },
                    {
                        title: "Book 2",
                        author: "Book 2 Author",
                        listBy: "Book 2 owner",
                        location: "Book 2 city",
                        listedDT: "Book 2 listed date-time",
                        info: "an old book",
                        _id: "0002"
                    }
                ]
            }
        }
    }
}
</script>
