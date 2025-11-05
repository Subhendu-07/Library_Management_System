const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

// Storage config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// Allow both image + pdf
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    return allowed.includes(ext)
      ? cb(null, true)
      : cb(new Error("Only .jpg, .jpeg, .png, .pdf allowed!"));
  },
});

// Routes
router.get("/getAll", getAllBooks);
router.get("/get/:id", getBook);
router.post("/add", upload.single("file"), addBook);
router.put("/update/:id", upload.single("file"), updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
