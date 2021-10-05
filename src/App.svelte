<!-- App.svelte -->
<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import About from "./routes/About.svelte";

	export let url = "";
</script>

<Router {url}>
	<nav id="nav">
		<Link to="/">Home</Link>
		<Link to="about">About</Link>
	</nav>
	<div id="rendered">
		<Route path="about" component={About} />
		<Route path="/"><Home /></Route>
	</div>
</Router>

<style>
	#rendered {
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
	}

	#nav {
		display: none; /* Hide the Navbar, as it is not needed for this project */
	}
</style>
