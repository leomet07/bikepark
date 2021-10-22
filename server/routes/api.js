const router = require("express").Router();
const dbRouter = require("./db/db").router;
const authRouter = require("./auth/auth").router;

const bucket = require("../bucket");
const { v4: uuid } = require("uuid");

router.get("/", (req, res) => {
	res.json({ message: "Hello world from /api." });
});
router.use("/db", dbRouter);
router.use("/auth", authRouter);

router.post("/bucket_upload", async (req, res, next) => {
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: "No file uploaded",
			});
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let file = req.files.file;
			const temp_filename = uuid() + "." + file.name.split(".").pop();

			const imageBuffer = Buffer.from(file.data);

			bucket.file(temp_filename).save(imageBuffer);
			const publicUrl = `https://storage.googleapis.com/${bucket.name}/${temp_filename}`;
			console.log(publicUrl);

			res.json({
				status: true,
				message: "File is uploaded",
				url: publicUrl,
			});
		}
	} catch {
		next(error);
	}
});
module.exports.router = router;
