const Book = require("../models/book");
const mongoose = require("mongoose");

// Get all books with author and genre populated
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre",
        },
      },
      { $unwind: { path: "$genre", preserveNullAndEmptyArrays: true } },
    ]);
    res.status(200).json({ success: true, booksList: books });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, err: err.message });
  }
};

// Get single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ success: false, err: "Book not found" });
    res.status(200).json({ success: true, book });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

// Add new book
const addBook = async (req, res) => {
  try {
    const { name, isbn, authorId, genreId, isAvailable, summary } = req.body;

    if (!name || !isbn || isAvailable === undefined) {
      return res
        .status(400)
        .json({ success: false, err: "Required fields missing" });
    }

    const newBook = {
      name,
      isbn,
      isAvailable: isAvailable === "true" || isAvailable === true, // ✅ string → bool
      summary: summary || "",
      photoUrl: req.file ? `/uploads/${req.file.filename}` : "",
    };

    if (authorId) newBook.authorId = new mongoose.Types.ObjectId(authorId);
    if (genreId) newBook.genreId = new mongoose.Types.ObjectId(genreId);

    const book = await Book.create(newBook);
    res.status(201).json({ success: true, newBook: book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err: err.message });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const updatedBook = { ...req.body };

    // ✅ convert isAvailable to bool if coming as string
    if (isAvailable !== undefined) {
      updatedBook.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    if (req.file) {
      updatedBook.photoUrl = `/uploads/${req.file.filename}`;
    }

    if (updatedBook.authorId) {
      updatedBook.authorId = new mongoose.Types.ObjectId(updatedBook.authorId);
    }
    if (updatedBook.genreId) {
      updatedBook.genreId = new mongoose.Types.ObjectId(updatedBook.genreId);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updatedBook, {
      new: true,
    });
    if (!book)
      return res.status(404).json({ success: false, err: "Book not found" });

    res.status(200).json({ success: true, updatedBook: book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err: err.message });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
      return res.status(404).json({ success: false, err: "Book not found" });
    res.status(200).json({ success: true, deletedBook: book });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

module.exports = { getAllBooks, getBook, addBook, updateBook, deleteBook };
