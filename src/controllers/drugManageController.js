const drugService = require('../services/drugmanageService');

/**
 * GET ALL DRUGS
 * Purpose: Populates the admin's main "Data Frame" (table).
 * Scenario: When the admin first opens the management page.
 */
const getDrugs = async (req, res) => {
    try {
        const drugs = await drugService.getAllDrugsForAdmin(); //
        res.status(200).json(drugs); //
    } catch (error) {
        res.status(500).json({ error: error.message }); //
    }
};

/**
 * GET SINGLE DRUG
 * Purpose: Fetches all fields to populate the "Edit" form.
 * Scenario: Triggered when the admin clicks the edit icon on a specific drug.
 */
const getSingleDrug = async (req, res) => {
    try {
        const drug = await drugService.getDrugById(req.params.id); //
        res.status(200).json(drug); //
    } catch (error) {
        res.status(404).json({ error: error.message }); //
    }
};

/**
 * UPSERT DRUG (Add or Edit)
 * Purpose: Forwards form data to Python for AI processing and saves to DB.
 * Scenario: Triggered when the admin clicks "Save" on either the Add or Edit form.
 */
const upsertDrug = async (req, res) => {
    try {
        // req.user.id is extracted from the 'protect' middleware in app.js
        const adminId = req.user.id; //
        
        // params.id will be present for Edits, and null for New additions
        const result = await drugService.saveToAiEngine(req.body, req.params.id, adminId); //
        
        res.status(200).json(result); //
    } catch (error) {
        // Python validation errors (like "Drug already exists") are caught here
        res.status(400).json({ error: error.message }); //
    }
};

/**
 * DELETE DRUG
 * Purpose: Removes the drug and records the deletion in the log.
 * Scenario: Triggered when the admin clicks the delete/trash icon.
 */
const deleteDrug = async (req, res) => {
    try {
        const adminId = req.user.id; //
        const result = await drugService.deleteFromDatabase(req.params.id, adminId); //
        res.status(200).json(result); //
    } catch (error) {
        res.status(500).json({ error: error.message }); //
    }
};

module.exports = {
    getDrugs,
    getSingleDrug,
    upsertDrug,
    deleteDrug
};