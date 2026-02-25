const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// Public: Get all active reviews
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin: Get all reviews (including hidden ones)
router.get("/all", auth, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin: Add a new review
router.post("/", auth, async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: Toggle visibility
router.patch("/:id/toggle", auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });
        review.isActive = !review.isActive;
        await review.save();
        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin: Delete a review
router.delete("/:id", auth, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Review removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Public: Like/Unlike a review
router.patch("/:id/like", async (req, res) => {
    try {
        const { action } = req.body; // 'like' or 'unlike'
        const incValue = action === 'unlike' ? -1 : 1;

        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        // Prevent likes from going below 0
        const newLikes = Math.max(0, (review.likes || 0) + incValue);
        review.likes = newLikes;
        await review.save();

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
