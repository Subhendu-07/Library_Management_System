const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("Only .jpg, .jpeg, .png allowed!"));
    cb(null, true);
  }
});

// Routes
router.get("/getAll", getAllBooks);
router.get("/get/:id", getBook);
router.post("/add", upload.single("photo"), addBook);
router.put("/update/:id", upload.single("photo"), updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
