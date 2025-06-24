const { getDB } = require('../database');

const getAllStates = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_state]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getStateById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('stateid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_state] WHERE stateid = @stateid');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createState = async (req, res) => {
    try {
        const { conid, state, status, archive } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query('INSERT INTO [dbo].[ATM_state] (conid, state, status, archive) VALUES (@conid, @state, @status, @archive)');
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateState = async (req, res) => {
    try {
        const { conid, state, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('stateid', req.params.id)
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query('UPDATE [dbo].[ATM_state] SET conid = @conid, state = @state, status = @status, archive = @archive WHERE stateid = @stateid');
        res.status(200).send('State updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteState = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('stateid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_state] WHERE stateid = @stateid');
        res.status(200).send('State deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState
}; 