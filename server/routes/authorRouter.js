const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAuthor,
  getAllAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor
} = require("../controllers/authorController");

// Multer storage for author photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only .jpg, .jpeg, .png allowed!"));
    }
    cb(null, true);
  },
});

// Routes
router.get("/getAll", getAllAuthors);
router.get("/get/:id", getAuthor);
router.post("/add", upload.single("photo"), addAuthor);
router.put("/update/:id", upload.single("photo"), updateAuthor);
router.delete("/delete/:id", deleteAuthor);

module.exports = router;
