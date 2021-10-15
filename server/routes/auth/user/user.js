const router = require("express").Router();
const User = require("../../../model/User");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
	res.json({ message: "/api/auth/user" });
});

router.get("/info/:token", async (req, res) => {
	let token = req.params.token;

	try {
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log(verified);
		const uid = verified._id;

		const user_found = await User.findById(uid);

		if (user_found) {
			res.json({ success: true, user: user_found });
		} else {
			res.json({ success: false });
		}
	} catch (err) {
		console.log("err in verifying the token in /user/info/:token", err);
		res.json({ success: false });
	}
});

module.exports.router = router;
