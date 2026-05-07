const axios = require('axios');
const Drug = require('../models/drug');
const DrugMasterLog = require('../models/drugMasterLog');

const PYTHON_API_URL = `${process.env.PYTHON_API_URL || "http://localhost:8000"}/drugs-management`;

// HELPER: Create the audit log
const createLog = async (adminId, action, drugId, drugName, details) => {
    try {
        await DrugMasterLog.create({ adminId, action, drugId, drugName, details });
    } catch (e) { console.error("Logging failed:", e); }
};

// 1. Fetch table data (Admin Data Frame)
const getAllDrugsForAdmin = async () => {
    return await Drug.find().select("-embedding").sort({ name: 1 });
};

// 2. Fetch single drug for the Edit Form
const getDrugById = async (id) => {
    const drug = await Drug.findById(id);
    if (!drug) throw new Error("Drug not found");
    return drug;
};

// 3. Forward Add/Edit to Python & Log
const saveToAiEngine = async (drugData, id = null, adminId) => {
    const url = id ? `${PYTHON_API_URL}/${id}` : `${PYTHON_API_URL}/`;
    const method = id ? 'put' : 'post';

    const response = await axios({ method, url, data: drugData });
    const savedDrug = response.data;

    await createLog(adminId, id ? "EDIT" : "ADD", savedDrug._id, savedDrug.name, drugData);
    return savedDrug;
};

// 4. Forward Delete to Python & Log
const deleteFromDatabase = async (id, adminId) => {
    const drug = await Drug.findById(id);
    if (!drug) throw new Error("Drug not found");

    await axios.delete(`${PYTHON_API_URL}/${id}`);
    await createLog(adminId, "DELETE", id, drug.name, { deletedAt: new Date() });

    return { message: "Deleted successfully" };
};

module.exports = { getAllDrugsForAdmin, getDrugById, saveToAiEngine, deleteFromDatabase };