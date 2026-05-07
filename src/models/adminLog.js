const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Admin", 
        required: true 
    },
    // Specifies if the action was on a 'DRUG' or a 'PHARMACY'
    targetType: { 
        type: String, 
        enum: ["DRUG", "PHARMACY"], 
        required: true 
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetName: { type: String, required: true },
    action: { 
        type: String, 
        enum: ["ADD", "EDIT", "DELETE", "APPROVE", "REJECT", "PROBLEM_NOTIFY"], 
        required: true 
    },
    details: { type: Object }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AdminLog", adminLogSchema);