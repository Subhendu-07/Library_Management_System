const Borrowal = require('../models/borrowal');
const mongoose = require("mongoose");
const Book = require("../models/book");

// Get single borrowal
const getBorrowal = async (req, res) => {
    try {
        const borrowal = await Borrowal.findById(req.params.id)
            .populate('memberId', 'name')
            .populate('bookId', 'name');

        if (!borrowal) return res.status(404).json({ success: false, message: "Borrowal not found" });

        res.status(200).json({ success: true, borrowal });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
};

const getAllBorrowals = async (req, res) => {
    try {
        const borrowals = await Borrowal.find()
            .populate("memberId", "name")
            .populate("bookId", "name");

        const formatted = borrowals.map(b => ({
            ...b._doc,
            member: b.memberId,
            book: b.bookId,
        }));

        res.status(200).json({ success: true, borrowalsList: formatted });

    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, err: err.message });
    }
};


// Add borrowal
const addBorrowal = async (req, res) => {
    try {
        const { bookId, memberId, borrowedDate, dueDate, status } = req.body;

        if (!bookId || !memberId) {
            return res.status(400).json({ success: false, message: "bookId and memberId are required" });
        }

        const newBorrowal = new Borrowal({
            bookId: mongoose.Types.ObjectId(bookId),
            memberId: mongoose.Types.ObjectId(memberId),
            borrowedDate: borrowedDate ? new Date(borrowedDate) : new Date(),
            dueDate: dueDate ? new Date(dueDate) : new Date(new Date().setDate(new Date().getDate() + 14)),
            status: status || "borrowed"
        });

        await newBorrowal.save();
        await Book.findByIdAndUpdate(bookId, { isAvailable: false });

        res.status(200).json({ success: true, newBorrowal });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
};

// Update borrowal
const updateBorrowal = async (req, res) => {
    try {
        const borrowalId = req.params.id;
        const updatedData = req.body;

        const updatedBorrowal = await Borrowal.findByIdAndUpdate(borrowalId, updatedData, { new: true });

        if (!updatedBorrowal) return res.status(404).json({ success: false, message: "Borrowal not found" });

        res.status(200).json({ success: true, updatedBorrowal });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
};

// Delete borrowal
const deleteBorrowal = async (req, res) => {
    try {
        const borrowalId = req.params.id;
        const borrowal = await Borrowal.findByIdAndDelete(borrowalId);

        if (!borrowal) return res.status(404).json({ success: false, message: "Borrowal not found" });

        await Book.findByIdAndUpdate(borrowal.bookId, { isAvailable: true });

        res.status(200).json({ success: true, deletedBorrowal: borrowal });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
};

module.exports = {
    getBorrowal,
    getAllBorrowals,
    addBorrowal,
    updateBorrowal,
    deleteBorrowal
};
