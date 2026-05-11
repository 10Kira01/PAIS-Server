const dashboardService = require('../services/dashboardService');
const Pharmacy = require('../models/pharmacy'); 

const getPharmacyDashboard = async (req, res) => {
  // 1. Get ID from the JWT token (Auth Middleware)
  const pharmacyId = req.user?._id || req.user?.id;

  if (!pharmacyId) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: No Pharmacy ID found in token."
    });
  }

  try {
    // 2. Parallel Fetch: Get Pharmacy Profile and AI Analytics at the same time
    const [pharmacy, aiAnalytics] = await Promise.all([
      Pharmacy.findById(pharmacyId).select('name location'),
      dashboardService.getDashboardAnalytics(pharmacyId)
    ]);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy record not found in the database."
      });
    }

    // 3. The "Baton Pass": Send combined data to the frontend
    res.status(200).json({
      success: true,
      data: {
        // Includes name and [Lng, Lat] coordinates for the map pin
        pharmacy, 
        // Spreads predictions, heatmap, opportunities, stats, and logs
        ...aiAnalytics 
      }
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: error.message,
      tip: "Check if the Python server is running and your MongoDB Atlas IP whitelist is active."
    });
  }
};

module.exports = { getPharmacyDashboard };