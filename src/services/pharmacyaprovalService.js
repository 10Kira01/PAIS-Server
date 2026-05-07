const Pharmacy = require("../models/pharmacy");
const Notification = require("../models/notification");
const AdminLog = require("../models/adminLog");
const { sendPharmacyConfirmationEmail } = require("../utils/emailMock");

// HELPER: Internal function to handle administrative logging
const createAdminLog = async (adminId, targetId, targetName, action, details) => {
    try {
        await AdminLog.create({
            adminId,
            targetType: "PHARMACY",
            targetId,
            targetName,
            action,
            details
        });
    } catch (e) { console.error("Admin Logging failed:", e.message); }
};

// 1. MISSING: Function to populate Admin Data Frame
const getAllPharmaciesForAdmin = async () => {
    return await Pharmacy.find().sort({ createdAt: -1 });
};

// 2. UPDATED: Logic for status changes
const changePharmacyStatus = async (pharmacyId, status, reason, providedLicenseId, adminId) => {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) throw new Error("PHARMACY_NOT_FOUND");

    if (status === "approved") {
        if (!providedLicenseId || providedLicenseId !== pharmacy.licenseId) {
            throw new Error("LICENSE_MISMATCH");
        }
    }

    pharmacy.status = status;
    await pharmacy.save();

    await createAdminLog(
        adminId, 
        pharmacy._id, 
        pharmacy.pharmacyName, 
        status === "approved" ? "APPROVE" : "REJECT", 
        { reason, licenseVerified: status === "approved" }
    );

    // MISSING: Actual Notification Logic
    await Notification.create({
        recipientId: pharmacy._id,
        recipientModel: 'Pharmacy',
        type: 'APPROVAL_STATUS',
        content: status === "approved" 
          ? "Congratulations! Your pharmacy registration has been approved."
          : `Your registration was rejected. Reason: ${reason || "Not provided."}`
    });

    // MISSING: Actual Email Logic
    try {
        await sendPharmacyConfirmationEmail(pharmacy, status, reason);
    } catch (e) { console.error("Email error:", e.message); }

    return pharmacy;
};

const sendProblemNotification = async (pharmacyId, message, adminId) => {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) throw new Error("PHARMACY_NOT_FOUND");

    const notification = await Notification.create({
        recipientId: pharmacy._id,
        recipientModel: 'Pharmacy',
        type: 'SYSTEM_MSG',
        content: `ADMIN MESSAGE: ${message}`
    });

    await createAdminLog(adminId, pharmacy._id, pharmacy.pharmacyName, "PROBLEM_NOTIFY", { message });

    return notification;
};

// 3. MISSING: Module Exports
module.exports = { 
    getAllPharmaciesForAdmin, 
    changePharmacyStatus, 
    sendProblemNotification 
};