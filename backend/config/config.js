// ============================================================
// SECURITY: ALL secrets MUST come from environment variables.
// Never hardcode passwords, emails, or hashes here.
// ============================================================

const jwtSecret = process.env.JWT_SECRET;

// SECURITY: Crash early if secret is missing (fail-secure)
// Never allow a hardcoded "dev" fallback in any environment.
if (!jwtSecret) {
    console.error("❌ ERROR: JWT_SECRET environment variable is missing.");
    console.error("Create a .env file and add: JWT_SECRET=your_secure_random_string");
    process.exit(1);
}

module.exports = {
    jwtSecret,
    // Bootstrap admin email comes from env — NOT hardcoded
    bootstrapAdminEmail: process.env.ADMIN_BOOTSTRAP_EMAIL || null,
};

