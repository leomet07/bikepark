<script>
	import auth from "../auth";

	import { validauthtoken, markers } from "../stores";

	const redMarker = L.icon({
		iconUrl: "/img/redmarker.png",
		iconSize: [25, 41],
		iconAnchor: [12.5, 41],
		popupAnchor: [0, -41],
	});
	const blueMarker = L.icon({
		iconUrl: "/img/bluemarker.png",
		iconSize: [25, 41],
		iconAnchor: [12.5, 41],
		popupAnchor: [0, -41],
	});

	async function login_handler(e) {
		e.preventDefault();
		const email = document.querySelector("#email_input").value;
		const password = document.querySelector("#password_input").value;

		auth.login(email, password);
	}

	const genPopup = (place) => {
		console.log("Gen Popup", place);
		const images_div =
			place.images.length > 0
				? `
		<div>
			<img width="200px" src="${place.images[0]}">
			<br>
		</div>`
				: `
					<input type="file" accept="image/png, image/jpg, image/jpeg"  id="upload_file_form"/>
					<input type='button' value='Upload Image' class='add_image_button'/><br/>`;

		return `
				<div class = "popup">
					<h5 class="place_id">${place._id}</h5>
					<h2>${place.name}</h2>
					<h2>Rating: ${place.rating}/5 satisfaction</h2>
					${images_div}
					<input type='button' value='Remove' class='remove_marker_button'/>
					
				</div>
				`;
	};
	const genVerifyCreate = () => {
		console.log("genVerifyCreate");
		return `
				<div class = "popup">
					<input class="proposed_name" id ="proposed_name" type="text" value="Untitled Marker"/>
					<br/>
					<button id = "verifybtn">Add it!</button>
				</div>
				`;
	};
	window.onload = async () => {
		const center = [40.717, -74.012];
		const startZoom = 18;

		let map = L.map("mapid", {
			tap: false,
		}).setView(center, startZoom);
		map.doubleClickZoom.disable();

		const popupOpenHandler = function () {
			const clickedMarker = this;

			console.log("Clicked marker");

			const dbID = clickedMarker.options.placeDBid;

			document
				.querySelector(".remove_marker_button")
				.addEventListener("click", async function () {
					if ($validauthtoken) {
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
					}
				});
			document
				.querySelector(".add_image_button")
				.addEventListener("click", async function () {
					if ($validauthtoken) {
						console.log("Add image button clicked ");
						const uploaded_files =
							document.getElementById("upload_file_form").files;

						if (uploaded_files.length > 0) {
							const uploaded_file = uploaded_files[0];
							console.log(uploaded_file);

							const formData = new FormData();

							formData.append("file", uploaded_file);
							const uploaded_response = await fetch(
								window.BASE_URL + "/api/bucket_upload",
								{
									method: "POST",
									body: formData,
								}
							);

							const uploaded_json =
								await uploaded_response.json();

							const image_url = uploaded_json.url;

							const added_response = await fetch(
								window.BASE_URL +
									"/api/db/add_img_url_to_place",
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										_id: dbID,
										image_url: image_url,
									}),
								}
							);

							const added_json = await added_response.json();

							const cloned_markers = $markers;
							cloned_markers[clickedMarker.options.index] =
								added_json.new;

							$markers = cloned_markers;
						}
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

		const leafletMarkers = L.layerGroup().addTo(map);
		const askMarkers = L.layerGroup().addTo(map);

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
		markers.subscribe((newmarkers) => {
			leafletMarkers.clearLayers();
			console.log("New markers: ", newmarkers);
			for (let i = 0; i < newmarkers.length; i++) {
				const place = newmarkers[i];

				const marker = L.marker([place.lat, place.long], {
					placeDBid: place._id,
					icon: blueMarker,
					index: i,
				}).addTo(leafletMarkers);

				marker.bindPopup(() => {
					return genPopup(place);
				});

				marker.on("popupopen", popupOpenHandler);
			}
		});
		const places = (await get_places_req.json()).places;

		$markers = places;

		map.addEventListener("dblclick", onMapClick);

		// Script for adding marker on map click
		async function onMapClick(e) {
			if ($validauthtoken) {
				console.log(e.latlng);
				const Askmarker = L.marker(e.latlng, {
					title: "Dropped Marker",
					alt: "Dropped Marker",
					riseOnHover: true,
					draggable: false,

					icon: redMarker,
				}).addTo(askMarkers);

				Askmarker.bindPopup(() => {
					return genVerifyCreate();
				});
				Askmarker.on("popupopen", () => {
					document
						.querySelector("#verifybtn")
						.addEventListener("click", async () => {
							console.log("Verified", e.latlng);

							// Get value from name field here
							const proposed_name =
								document.getElementById("proposed_name").value;

							const createreq = await fetch(
								window.BASE_URL + "/api/db/create_place",
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
										"auth-token": $validauthtoken,
									},
									body: JSON.stringify({
										name: proposed_name,
										rating: 5,
										lat: e.latlng.lat,
										long: e.latlng.lng,
									}),
								}
							);
							const createjson = await createreq.json();

							if (createjson.success) {
								askMarkers.removeLayer(Askmarker);

								$markers = [...$markers, createjson.place];
							}
						});
				});
			}
		}
	};
</script>

<main id="home">
	<div id="navbar">
		<div id="titleparent" class="navchild">
			<span class="eachinside">BikePark</span>
		</div>
		{#if $validauthtoken == ""}
			<form>
				<div class="navchild">
					<span class="eachinside inputfieldlocationparent">
						<input
							class="inputfieldlocation"
							type="email"
							id="email_input"
						/>
					</span>
				</div>
				<div class="navchild">
					<span class="eachinside inputfieldlocationparent">
						<input
							class="inputfieldlocation"
							type="password"
							id="password_input"
						/>
					</span>
				</div>
				<div class="navchild">
					<span class="eachinside navbtnparent">
						<button
							on:click={login_handler}
							class="inputfieldlocation navbtn"
							id="loginbtn"
						>
							Go!
						</button>
					</span>
				</div>
			</form>
		{:else}
			<div class="navchild">
				<span class="eachinside navbtnparent">
					<button
						on:click={auth.logout}
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
	}
	.navbtnparent {
		padding-top: 3px;
	}

	.navbtn {
		background-color: white;
		color: black;
		height: 25px;
		padding-top: 2px;
		border: 1px solid black;

		border-radius: 0px;
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
