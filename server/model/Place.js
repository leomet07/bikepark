const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	long: {
		type: Number,
		required: true,
	},
	lat: { type: Number, required: true },
	rating: { type: Number, min: 1, max: 5, required: true },
});

const placeModelfordb = mongoose.model("Place", placeSchema);

module.exports = placeModelfordb;
