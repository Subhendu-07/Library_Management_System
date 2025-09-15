const express = require("express");
const router = express.Router();
const {
    getBorrowal,
    getAllBorrowals,
    addBorrowal,
    updateBorrowal,
    deleteBorrowal
} = require('../controllers/BorrowalController');

router.get("/getAll", getAllBorrowals);
router.get("/get/:id", getBorrowal);
router.post("/add", addBorrowal);
router.put("/update/:id", updateBorrowal);
router.delete("/delete/:id", deleteBorrowal);

module.exports = router;
