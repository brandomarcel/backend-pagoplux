const express = require('express');
const axios = require('axios');
const router = express.Router();
const Buffer = require('buffer').Buffer;
const authMiddleware = require('../middleware/authMiddleware'); // <== Importas el middleware

require('dotenv').config();
const username = process.env.PAGOPLUX_USER;
const password = process.env.PAGOPLUX_PASS;

router.get('/consultar-transaccionID', authMiddleware, async (req, res) => {
    const { idTransaction } = req.query;

    if (!idTransaction) {
        return res.status(400).json({ error: 'ID de transaccion es requerido' });
    }

    try {
        const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
        const url = `https://apipre.pagoplux.com/intv1/integrations/getTransactionByIdStateResource?idTransaction=${idTransaction}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: authHeader
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error consultando transacción:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al consultar transacción' });
    }
});

module.exports = router;
