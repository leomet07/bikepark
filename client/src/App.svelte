<!-- App.svelte -->
<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import About from "./routes/About.svelte";

	window.BASE_URL = "https://bikeparkbackend.herokuapp.com";
	if (
		window.location.hostname == "localhost" ||
		window.location.hostname == "127.0.0.1"
	) {
		console.log("In development mode");
		window.BASE_URL = "http://127.0.0.1:8060";
	}

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
