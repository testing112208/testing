const router = require("express").Router();
const { getAllPricing, updatePricing, bulkUpdatePricing } = require("../controllers/pricingController");
const auth = require("../middleware/auth");
const { checkRole } = require("../middleware/checkRole");
const idempotency = require("../middleware/idempotency");

router.get("/", getAllPricing);
router.post("/update", auth, checkRole(['Super Admin', 'Manager']), idempotency, updatePricing);
router.post("/bulk-update", auth, checkRole(['Super Admin', 'Manager']), idempotency, bulkUpdatePricing);

module.exports = router;
