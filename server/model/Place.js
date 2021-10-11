const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
	text: {
		required: true,
		type: String,
	},
});

const placeModelfordb = mongoose.model("Place", placeSchema);

module.exports = placeModelfordb;
