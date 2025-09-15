const Author = require("../models/author");

// --- Read single author ---
const getAuthor = async (req, res) => {
  const authorId = req.params.id;

  Author.findById(authorId, (err, author) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      author,
    });
  });
};

// --- Read all authors ---
const getAllAuthors = async (req, res) => {
  Author.find({}, (err, authors) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      authorsList: authors,
    });
  });
};

// --- Create new author ---
const addAuthor = async (req, res) => {
  try {
    const newAuthor = {
      ...req.body,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : "",
    };

    const author = await Author.create(newAuthor);
    res.status(200).json({ success: true, newAuthor: author });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

// Update
const updateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const updatedAuthor = {
      ...req.body,
    };

    if (req.file) {
      updatedAuthor.photoUrl = `/uploads/${req.file.filename}`;
    }

    const author = await Author.findByIdAndUpdate(authorId, updatedAuthor, {
      new: true,
    });

    res.status(200).json({ success: true, updatedAuthor: author });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

// --- Delete author ---
const deleteAuthor = async (req, res) => {
  const authorId = req.params.id;

  Author.findByIdAndDelete(authorId, (err, author) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      deletedAuthor: author,
    });
  });
};

module.exports = {
  getAuthor,
  getAllAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
