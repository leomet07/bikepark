const router = require("express").Router();
const Place = require("../../model/Place");
const verifyToken = require("../auth/middlewares/verifyToken");
// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Hello world for /api/db" });
});

router.get("/get_places", get_places_handler);
router.post("/get_places", get_places_handler);
// Create an place
router.post("/create_place", verifyToken, async (req, res, next) => {
	try {
		console.log("req.body", req.body);
		const saved_place = await create_place(req.body);

		res.json({
			place: saved_place,
			description: "Successfully created the place.",
			success: true,
		});
	} catch (error) {
		next(error);
	}
});

router.delete("/delete_place", verifyToken, async (req, res, next) => {
	try {
		const idToDelete = req.body._id;

		await delete_place(idToDelete);

		res.json({ success: true, message: "Deleted successfully" });
	} catch (error) {
		next(error);
	}
});

router.post("/add_img_url_to_place", async (req, res, next) => {
	try {
		if (!req.body.image_url) {
			console.log("No image url provided");

			throw new Error("image_url was not provided in request body");
		}

		const old_images = (await Place.findById(req.body._id)).images;

		const updated = await Place.findByIdAndUpdate(
			req.body._id,
			{
				images: [...old_images, req.body.image_url],
			},
			{ new: true }
		);

		res.json({
			success: true,
			new: updated,
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
async function delete_place(id) {
	const doesExist = await Place.findById(id);

	if (!doesExist) {
		throw new Error("Cannot delete place that does not exist");
	}

	const success = await Place.deleteOne({ _id: id });
}
module.exports.router = router;
