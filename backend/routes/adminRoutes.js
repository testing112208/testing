const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const pricingCtrl = require("../controllers/pricingController");
const auth = require("../middleware/auth");
const { checkRole } = require("../middleware/checkRole");

router.post("/login", ctrl.login);

// Admin Profile & Security
router.get("/profile", auth, ctrl.getProfile);
router.post("/change-password", auth, ctrl.changePassword);
router.get("/sessions", auth, ctrl.getSessions);
router.post("/sessions/logout", auth, ctrl.logoutSession);
router.get("/logs", auth, checkRole(["Super Admin"]), ctrl.getLogs);
router.get("/whatsapp/status", auth, ctrl.getWhatsappStatus);
router.post("/whatsapp/reset", auth, checkRole(["Super Admin"]), ctrl.resetWhatsapp);


// Pricing management (Admin only)
router.get("/pricing", auth, checkRole(["Super Admin", "Manager"]), pricingCtrl.getAllPricing);
router.post("/pricing", auth, checkRole(["Super Admin"]), pricingCtrl.bulkUpdatePricing);

module.exports = router;
