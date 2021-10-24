import { validauthtoken } from "./stores";

async function logout() {
	window.localStorage.setItem("auth-token", "");
	validauthtoken.set("");
}

async function login(email, password) {
	let response = await fetch(window.BASE_URL + "/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
	let responsejson = await response.json();
	console.log(responsejson);
	if (responsejson.logged_in) {
		let token = responsejson.token;
		window.localStorage.setItem("auth-token", token);

		validauthtoken.set(token);
		console.log(token);
	}
}
async function register(email, password) {
	let response = await fetch(window.BASE_URL + "/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
	let responsejson = await response.json();
	console.log(responsejson);
	if (responsejson.logged_in) {
		let token = responsejson.token;
		window.localStorage.setItem("auth-token", token);

		validauthtoken.set(token);
		console.log(token);
	}
}
export default { logout, login, register };
