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
    
    // FIXED: Robustly checks both ._id and .id to ensure your logging system receives the token payload cleanly
    const adminId = req.user ? (req.user._id || req.user.id) : null; 

    if (!adminId) {
       return res.status(401).json({ success: false, message: "Administrative authorization identification missing." });
    }

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
 */
const notifyPharmacyProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // FIXED: Normalized fallback security parameters applied here as well
    const adminId = req.user ? (req.user._id || req.user.id) : null;

    if (!adminId) {
       return res.status(401).json({ success: false, message: "Administrative authorization identification missing." });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: "Message content is required." });
    }

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