const router = require("express").Router();
const dbRouter = require("./db/db").router;
const authRouter = require("./auth/auth").router;
router.get("/", (req, res) => {
	res.json({ message: "Hello world from /api." });
});
router.use("/db", dbRouter);
router.use("/auth", authRouter);

module.exports.router = router;
