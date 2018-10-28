<template>
	<div id="app">
		<v-app>
			<navigation></navigation>
			<v-content>
				<router-view/>
			</v-content>
		</v-app>
	</div>
</template>

<script>
import Navigation from "./components/Navigation.vue"
export default {
	components: {
		Navigation
	},
	created() {
		const localObj = JSON.parse(localStorage.getItem("token"))
		if (localObj) {
			if (new Date(localObj.exp) >= new Date()) {
				this.$store.dispatch("login", 
					{
						token: localObj.token,
						email: localObj.email,
						userName: localObj.userName,
						id: localObj.id
					}
				)
			}
		}
	}
}
</script>


<style lang="sass">

</style>
