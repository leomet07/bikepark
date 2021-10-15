<script>
	const popup = `<input type='button' value='Remove' class='remove_marker_button'/>`;

	let email_input;
	let password_input;
	import { validauthtoken } from "../stores";

	window.onload = async () => {
		const center = [40.717, -74.012];
		const startZoom = 18;

		let map = L.map("mapid", { tap: false }).setView(center, startZoom);
		map.doubleClickZoom.disable();

		const popupOpenHandler = function () {
			const clickedMarker = this;

			console.log("Clicked marker");

			const dbID = clickedMarker.options.placeDBid;

			document
				.querySelector(".remove_marker_button")
				.addEventListener("click", async function () {
					console.log("Clicked delete");
					const delreq = await fetch(
						window.BASE_URL + "/api/db/delete_place",
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								"auth-token": $validauthtoken,
							},
							body: JSON.stringify({ _id: dbID }),
						}
					);

					const deljson = await delreq.json();

					if (deljson.success) {
						map.removeLayer(clickedMarker);
					}
				});
		};
		L.tileLayer(
			"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
			{
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 22,

				id: "mapbox/streets-v11",
				tileSize: 512,
				zoomOffset: -1,
				accessToken:
					"pk.eyJ1IjoibGVvbWV0MDciLCJhIjoiY2t1MXF1a3hyMHU5YTJ1cXJtc2h0c2p4byJ9.51pAyGOoPcLceOEWehyP0g",
			}
		).addTo(map);

		const get_places_req = await fetch(
			window.BASE_URL + "/api/db/get_places",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: "{}",
			}
		);

		const places = (await get_places_req.json()).places;

		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			const marker = L.marker([place.lat, place.long], {
				placeDBid: place._id,
			}).addTo(map);
			marker.bindPopup(popup);

			marker.on("popupopen", popupOpenHandler);
		}

		validauthtoken.subscribe((value) => {
			if (value) {
				map.addEventListener("dblclick", onMapClick);
			}
		});

		// Script for adding marker on map click
		async function onMapClick(e) {
			console.log(e.latlng);

			const createreq = await fetch(
				window.BASE_URL + "/api/db/create_place",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-token": $validauthtoken,
					},
					body: JSON.stringify({
						name: "Citi",
						lat: e.latlng.lat,
						long: e.latlng.lng,
					}),
				}
			);

			const createjson = await createreq.json();

			if (createjson.success) {
				const marker = L.marker(e.latlng, {
					title: "Dropped Marker",
					alt: "Dropped Marker",
					riseOnHover: true,
					draggable: false,
					placeDBid: createjson.place._id,
				}).addTo(map);

				marker.bindPopup(popup);
				marker.on("popupopen", popupOpenHandler);
			}
		}
	};
	async function login_handler(e) {
		e.preventDefault();
		console.log({ email_input, password_input });
		let response = await fetch(window.BASE_URL + "/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email_input,
				password: password_input,
			}),
		});
		let responsejson = await response.json();
		console.log(responsejson);
		if (responsejson.logged_in) {
			let token = responsejson.token;
			window.localStorage.setItem("auth-token", token);

			$validauthtoken = token;
			console.log($validauthtoken);
		}
	}
</script>

<main id="home">
	<div id="navbar">
		<div id="titleparent" class="navchild">
			<span class="eachinside">BikePark</span>
		</div>
		{#if $validauthtoken == ""}
			<form on:submit={login_handler}>
				<div class="navchild">
					<span class="eachinside inputfieldlocationparent">
						<input
							class="inputfieldlocation"
							type="email"
							bind:value={email_input}
						/>
					</span>
				</div>
				<div class="navchild">
					<span class="eachinside inputfieldlocationparent">
						<input
							class="inputfieldlocation"
							type="password"
							bind:value={password_input}
						/>
					</span>
				</div>
				<div class="navchild">
					<span class="eachinside navbtnparent">
						<input
							class="inputfieldlocation navbtn"
							id="loginbtn"
							type="submit"
							value="Go!"
						/>
					</span>
				</div>
			</form>
		{:else}
			<div class="navchild">
				<span class="eachinside navbtnparent">
					<button
						class="inputfieldlocation navbtn"
						id="logoutbtn"
						type="submit">Log Out</button
					></span
				>
			</div>
		{/if}
	</div>
	<div id="mapid" />
</main>

<style>
	#navbar {
		float: left;
		background-color: pink;
		width: 100vw;
		/* height: 4vh; */
		/* min-height: 30px; */
		height: 30px;
		overflow: none;
	}
	.navchild,
	#titleparent {
		float: left;
		margin: 0px;
		padding: 0px;
		max-width: max(150px, 6vw);
		margin-right: 1vw;
	}

	.eachinside {
		display: block;
		color: black;
		text-align: center;
		padding-top: 5px;
		padding-bottom: 10px;
		overflow: none;
		text-decoration: none;
		min-height: 30px;
		margin-right: 1vw;
		margin-left: 1vw;
		white-space: nowrap;
	}

	.inputfieldlocation {
		width: max(150px, 6vw);
		height: 20px;
		border: none;
		border-radius: 0px;
		font-size: 14px;
		border: 1px solid black;
	}
	.inputfieldlocationparent {
		padding-top: 4px;

		padding-bottom: 5px;
	}

	#home {
		width: 100%;
		height: 100%;
		background-color: blue;
	}
	#mapid {
		margin: 0px;
		width: 100%;
		height: calc(100vh - 30px);
		/* height: 96vh; */
	}
	.navbtnparent {
		padding-top: 3px;
	}

	.navbtn {
		height: 25px;
		border: 1px solid black;

		padding-top: 2px;
	}
	#loginbtn {
		width: 35px;
	}
	#logoutbtn {
		width: 65px;
	}

	@media only screen and (max-width: 900px) {
		#titleparent {
			display: none;
		}

		#navbar {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
