const router = require("express").Router();
const ctrl = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const { validateBooking, validateStatus } = require("../middleware/validate");
const idempotency = require("../middleware/idempotency");

router.post("/", idempotency, validateBooking, ctrl.createBooking); // Public
router.get("/", auth, ctrl.getAllBookings);
router.get("/:id", auth, ctrl.getBookingById);
router.put("/:id/status", auth, validateStatus, ctrl.updateBookingStatus);

module.exports = router;
