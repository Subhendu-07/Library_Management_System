const mongoose = require("mongoose");

const borrowalSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Book" },
    memberId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    borrowedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: { type: String, default: "borrowed" }
});

module.exports = mongoose.model("Borrowal", borrowalSchema);
