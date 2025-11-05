const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isbn: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: false },
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: false },
  isAvailable: { type: Boolean, required: true },
  summary: { type: String, required: false },

  // Separate URLs for image and PDF
  photoUrl: { type: String, required: false }, // image file path
  pdfUrl: { type: String, required: false },   // pdf file path
});

module.exports = mongoose.model("Book", bookSchema);
