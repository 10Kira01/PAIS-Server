const adminService = require("../services/pharmacyaprovalService");

const getPharmacies = async (req, res) => {
    try {
        const data = await adminService.getAllPharmaciesForAdmin();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const updateStatus = async (req, res) => {
  try {
    const { status, reason, licenseId } = req.body; 
    
    // MISSING PIECE: Extract the admin's ID for logging
    const adminId = req.user.id; 

    // FIXED: Added 'adminId' as the last parameter
    const updated = await adminService.changePharmacyStatus(
        req.params.id, 
        status, 
        reason, 
        licenseId, 
        adminId 
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    const code = error.message === "LICENSE_MISMATCH" ? 400 : 500;
    res.status(code).json({ success: false, message: error.message });
  }
};

/**
 * NOTIFY PHARMACY PROBLEM
 * Triggered when Admin sends a custom message regarding a problem.
 */
const notifyPharmacyProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // MISSING PIECE: Extract the admin's ID for logging
    const adminId = req.user.id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message content is required." });
    }

    // FIXED: Added 'adminId' as the last parameter
    await adminService.sendProblemNotification(id, message, adminId);

    res.status(200).json({ 
      success: true, 
      message: "Notification sent to pharmacy successfully." 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getPharmacies, updateStatus, notifyPharmacyProblem };