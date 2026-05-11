const cron = require('node-cron');
const axios = require('axios');

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

const initAutoRetrain = () => {
  // SCHEDULE: Every Sunday at 3:00 AM
  // Cron pattern: minute hour dayOfMonth month dayOfWeek
  cron.schedule('0 3 * * 0', async () => {
    console.log('🕒 [CRON] Starting Scheduled AI Retraining on Sunday at 3AM...');
    
    try {
      // Trigger the POST endpoint to update 'pais_demand_forecaster.pkl'
      const response = await axios.post(`${PYTHON_API_URL}/model/train`);
      
      console.log('✅ [CRON] Success! Samples processed:', response.data.samples);
    } catch (error) {
      console.error('❌ [CRON] Failed to retrain model:', error.message);
      console.error('💡 TIP: Is the Python server running at:', PYTHON_API_URL);
    }
  });

  console.log('📅 AI Retraining Scheduler: Active (Running every Sunday at 3AM)');
};

module.exports = { initAutoRetrain };