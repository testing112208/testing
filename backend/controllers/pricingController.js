const Pricing = require("../models/Pricing");
const cache = require("../services/cacheService");

const PRICING_CACHE_KEY = "global_pricing_data";

// Get all pricing - Optimized with Caching
exports.getAllPricing = async (req, res) => {
    try {
        // 1. Try to get from Cache
        try {
            const cachedPricing = await cache.get(PRICING_CACHE_KEY);
            if (cachedPricing) {
                res.set('Cache-Control', 'public, max-age=3600');
                return res.json({ success: true, data: cachedPricing, cached: true });
            }
        } catch (err) {
            console.error("Cache Read Error:", err.message);
        }

        // 2. If not in cache, get from DB
        const pricing = await Pricing.find().lean();

        // 3. Save to Cache for 1 hour
        try {
            await cache.set(PRICING_CACHE_KEY, pricing, 3600);
        } catch (err) {
            console.error("Cache Write Error:", err.message);
        }

        res.set('Cache-Control', 'public, max-age=3600');
        res.json({ success: true, data: pricing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update or create pricing
exports.updatePricing = async (req, res) => {
    const { cabType, basePrice, priceUnit, description, imageUrl } = req.body;
    try {
        const pricing = await Pricing.findOneAndUpdate(
            { cabType },
            { basePrice, priceUnit, description, imageUrl, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        // Invalidate Cache
        try {
            await cache.del(PRICING_CACHE_KEY);
        } catch (err) {
            console.error("Cache Delete Error:", err.message);
        }

        res.json({ success: true, data: pricing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk update pricing
exports.bulkUpdatePricing = async (req, res) => {
    const { pricings } = req.body;

    // BUSINESS LOGIC SAFETY: Ensure no negative prices
    const hasInvalidPrice = pricings.some(p => p.basePrice < 0);
    if (hasInvalidPrice) {
        return res.status(400).json({ success: false, message: "Prices cannot be negative." });
    }

    try {

        const operations = pricings.map(p => {
            const { _id, ...updateData } = p;
            return {
                updateOne: {
                    filter: { cabType: p.cabType },
                    update: { ...updateData, updatedAt: Date.now() },
                    upsert: true
                }
            };
        });
        await Pricing.bulkWrite(operations);

        // Invalidate Cache after bulk update
        try {
            await cache.del(PRICING_CACHE_KEY);
        } catch (err) {
            console.error("Cache Bulk Delete Error:", err.message);
        }

        const updatedPricing = await Pricing.find().lean();
        res.json({ success: true, data: updatedPricing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
