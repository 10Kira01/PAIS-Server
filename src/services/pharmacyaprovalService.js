const Pharmacy = require("../models/pharmacy");
const Notification = require("../models/notification");
const AdminLog = require("../models/adminLog");
const { sendPharmacyConfirmationEmail } = require("../utils/emailMock");

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

const getAllPharmaciesForAdmin = async () => {
    return await Pharmacy.find().sort({ createdAt: -1 });
};

// FIXED: String normalization added during verification check to eliminate license comparison bugs
const changePharmacyStatus = async (pharmacyId, status, reason, providedLicenseId, adminId) => {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) throw new Error("PHARMACY_NOT_FOUND");

    if (status === "approved") {
        // String conversion guarantees undefined variables don't crash comparison matching
        const incomingLicense = String(providedLicenseId || '').trim();
        const storedLicense = String(pharmacy.licenseId || '').trim();
        console.log("👉 DEBUG LOG -> Pharmacy ID:", pharmacyId, "Incoming from Frontend:", `"${incomingLicense}"`, "Stored in MongoDB database:", `"${storedLicense}"`);

        if (!incomingLicense || incomingLicense !== storedLicense) {
            console.log(`Mismatch Debug -> Received: "${incomingLicense}", Expected: "${storedLicense}"`);
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

    await Notification.create({
        recipientId: pharmacy._id,
        recipientModel: 'Pharmacy',
        type: 'APPROVAL_STATUS',
        content: status === "approved" 
          ? "Congratulations! Your pharmacy registration has been approved."
          : `Your registration was rejected. Reason: ${reason || "Not provided."}`
    });

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

module.exports = { 
    getAllPharmaciesForAdmin, 
    changePharmacyStatus, 
    sendProblemNotification 
};