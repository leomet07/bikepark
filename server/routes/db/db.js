const router = require("express").Router();
const Place = require("../../model/Place");

// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Hello world for /api/db" });
});

router.get("/get_places", get_places_handler);
router.post("/get_places", get_places_handler);
// Create an place
router.post("/create_place", async (req, res, next) => {
	try {
		console.log("req.body", req.body);
		const saved_place = await create_place(req.body);

		res.json({
			place: saved_place,
			description: "Successfully created the place.",
		});
	} catch (error) {
		next(error);
	}
});

async function create_place(query) {
	let place = await Place.create(query);
	let saved_place = await place.save();
	return saved_place;
}
async function get_places(query) {
	let places = await Place.find(query);
	return places;
}
async function get_places_handler(req, res, next) {
	try {
		const places = await get_places(req.body || {});
		res.json({
			places: places,
			description: "Successfully retrieved places.",
		});
	} catch (error) {
		next(error);
	}
}

module.exports.router = router;
