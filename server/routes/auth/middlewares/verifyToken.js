const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		console.log("verify token middleware says access denied");
		return res.status(401).send({ message: "Token not included." });
	}

	try {
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		console.log("verify token middleware says error! ", err);
		return res
			.status(401)
			.send({ message: "Invalid token -> Access denied" });
	}
};
