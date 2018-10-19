<template>
	<v-layout row justify-center>
		<v-dialog v-model="dialog" persistent>
			<v-card>
				<v-card-title class="headline">List a new book</v-card-title>
				<v-card-text>
					<v-form v-model="valid">
						<v-text-field
							color="green lighten-1" 
							prepend-icon="title" 
							name="title" 
							label="Title" 
							type="text" 
							v-model="bookData.title"
							:rules="[rules.required]"
						></v-text-field>

						<v-text-field
							color="green lighten-1" 
							prepend-icon="face" 
							name="author" 
							label="Author" 
							type="text" 
							v-model="bookData.author"
							:rules="[rules.required]"
						></v-text-field>

						<v-textarea
							color="green lighten-1" 
							v-model="bookData.otherInfo"
							prepend-icon="info"
							label="Additional information"
							counter
							maxlength="120"
							single-line
						></v-textarea>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn 
						color="green darken-1" 
						flat 
						@click.native="ListBook" 
						:disabled=!valid
					>Confirm</v-btn>
					
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
			bookData: {
				title: "",
				author: "",
				otherInfo: ""
			},
			rules: {
				required: value => !!value || "Required."
			}
		}
	},
	methods: {
		openModal() {
			this.dialog = true
		},
		async ListBook() {
			const book = {
				title: this.bookData.title,
				author: this.bookData.author,
				info: this.bookData.otherInfo,
				listedBy: "Me"
			}
			try {
				const bookResponse = await BookService.add(book)
				console.log("bookResponse: ", bookResponse)
				this.dialog = false
			} catch (error) {
				console.log("error with posting the book: ", error)
			}
		}
	}
}
</script>
