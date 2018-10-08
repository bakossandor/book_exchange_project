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
	}
}
</script>


<style lang="sass">

</style>
