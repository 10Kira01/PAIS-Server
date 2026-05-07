const mongoose = require("mongoose");

const drugMasterLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["ADD", "EDIT", "DELETE"], required: true },
    drugId: { type: mongoose.Schema.Types.ObjectId },
    drugName: { type: String, required: true },
    details: { type: Object }, // Stores the data sent during the action
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DrugMasterLog", drugMasterLogSchema);