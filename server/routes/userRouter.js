const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/getAll", getAllUsers);
router.get("/getAllMembers", getAllMembers);
router.get("/get/:id", getUser);
router.post("/add", upload.single("photo"), addUser); 
router.put("/update/:id", upload.single("photo"), updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
