const Inventory = require('../models/inventory');
const StockUpdateLog = require('../models/stockupdateLog');
const axios = require('axios');

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

const getDashboardAnalytics = async (pharmacyId) => {
  // 1. Prepare all 4 requests for parallel execution
  const aiPredictReq = axios.get(`${PYTHON_API_URL}/model/predict/${pharmacyId}`);
  const heatmapReq = axios.get(`${PYTHON_API_URL}/analytics/heatmap/${pharmacyId}`);
  const oppsReq = axios.get(`${PYTHON_API_URL}/model/opportunities/${pharmacyId}`);
  const logsReq = StockUpdateLog.find({ pharmacyId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('drugId', 'name');

  // 2. Promise.allSettled ensures the dashboard still loads even if the AI is sleepy
  const [aiRes, heatRes, oppsRes, recentLogs] = await Promise.allSettled([
    aiPredictReq,
    heatmapReq,
    oppsReq,
    logsReq
  ]);

  // 3. Extract data with fallback safety
  const predictions = aiRes.status === 'fulfilled' ? aiRes.value.data : [];
  const heatmap = heatRes.status === 'fulfilled' ? heatRes.value.data : [];
  const opportunities = oppsRes.status === 'fulfilled' ? oppsRes.value.data : [];
  const logs = recentLogs.status === 'fulfilled' ? recentLogs.value : [];

  // 4. Debugging logs for your Node terminal
  if (aiRes.status === 'rejected') console.error("AI Predict Error:", aiRes.reason.message);
  if (oppsRes.status === 'rejected') console.error("Opportunities Error:", oppsRes.reason.message);

  const criticalItemsCount = predictions.filter(p => p.status === 'CRITICAL').length;
  
  return {
    predictions,
    heatmap,
    opportunities, // New: Market gaps discovered by AI
    recentLogs: logs,
    stats: {
      totalItemsPredicted: predictions.length,
      criticalAlerts: criticalItemsCount,
      aiStatus: aiRes.status === 'fulfilled' ? "online" : "offline"
    }
  };
};

module.exports = { getDashboardAnalytics };