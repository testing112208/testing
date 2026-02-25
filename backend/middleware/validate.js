exports.validateBooking = (req, res, next) => {
    const { customerName, phone, pickup, drop, cabType, date, time } = req.body;
    const errors = [];
    if (!customerName?.trim()) errors.push("customerName is required");
    if (!phone?.trim()) errors.push("phone is required");
    if (!pickup?.trim()) errors.push("pickup is required");
    if (!drop?.trim()) errors.push("drop is required");
    const validCabTypes = [
        "Sedan Cab Amravati",
        "SUV Taxi Service",
        "Nagpur Pick-up & Drop",
        "Corporate Taxi Hire",
        "Intercity Cab Amravati",
        "Mini Van (Winger)",
        "Cruiser",
        "Tempo Traveller Taxi",
        "Sedan", "SUV", "Tempo Traveller", // Legacy support
        "Local Taxi in Amravati", "Outstation Cab Booking" // Services Section support
    ];
    if (!validCabTypes.includes(cabType)) errors.push("Invalid cabType");
    if (!date) errors.push("date is required");
    if (!time) errors.push("time is required");
    if (errors.length) return res.status(400).json({ success: false, errors });
    next();
};

exports.validateStatus = (req, res, next) => {
    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }
    next();
};
