<script>
	window.onload = async () => {
		const center = [40.717, -74.012];
		const startZoom = 18;

		let map = L.map("mapid").setView(center, startZoom);

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

		const req = await fetch(window.BASE_URL + "/api/db/get_places", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: "{}",
		});

		const places = (await req.json()).places;

		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			L.marker([place.lat, place.long], {}).addTo(map);
		}

		map.on("click", onMapClick);
		// Script for adding marker on map click
		function onMapClick(e) {
			const marker = L.marker(e.latlng, {
				title: "Dropped Marker",
				alt: "Dropped Marker",
				riseOnHover: true,
				draggable: false,
			})
				.bindPopup(
					"<input type='button' value='Remove' class='remove_marker_button'/>"
				)
				.addTo(map);

			marker.on("popupopen", function () {
				const clickedMarker = this;

				console.log("Clicked marker");
				document
					.querySelector(".remove_marker_button")
					.addEventListener("click", function () {
						console.log("Clicked delete");
						map.removeLayer(clickedMarker);
					});
			});
		}
	};
</script>

<main id="home">
	<div id="navbar">
		<div class="navchild">
			<span class="navtext">BikePark</span>
		</div>
		<div class="navchild">
			<span class="navtext inputfieldlocationparent">
				<input class="inputfieldlocation" type="text" />
			</span>
		</div>
		<div class="navchild">
			<span class="navtext inputfieldlocationparent">
				<input class="inputfieldlocation" type="text" />
			</span>
		</div>
	</div>
	<div id="mapid" />
</main>

<style>
	#navbar {
		float: left;
		background-color: pink;
		height: 4vh;
		width: 100vw;
		min-height: 30px;
	}
	.navchild {
		float: left;
		margin: 0px;
		padding: 0px;
	}

	.navtext {
		display: block;
		color: black;
		text-align: center;
		padding-top: max(7px, 1vh);
		padding-bottom: max(10px, 1vh);
		overflow: hidden;
		text-decoration: none;
		min-height: 30px;
		margin-right: 1vw;
		margin-left: 1vw;
	}

	.inputfieldlocation {
		width: max(150px, 6vw);
		height: max(3vh, 20px);
		border: none;
		border-radius: 0px;
	}
	.inputfieldlocationparent {
		padding-top: max(5px, 0.5vh);
		padding-bottom: max(5px, 0.5vh);
	}

	#home {
		width: 100%;
		height: 100%;
		background-color: blue;
	}
	#mapid {
		margin: 0px;
		width: 100%;
		height: calc(100vh - max(4vh, 30px));
		/* height: 96vh; */
	}
</style>
