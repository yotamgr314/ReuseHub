const express = require("express");
const { register, login } = require("../controllers/authenticateController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
