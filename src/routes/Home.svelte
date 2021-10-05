<script>
	window.onload = function () {
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

		L.marker(center, {}).addTo(map);
	};
</script>

<main id="home">
	<div id="mapid" />
</main>

<style>
	#home {
		width: 100%;
		height: 100%;
	}
	#mapid {
		width: 100%;
		height: 100%;
	}
</style>
