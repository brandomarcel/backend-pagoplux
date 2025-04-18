const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🔥 Conectado a MongoDB'))
    .catch(err => console.log(err));


// Rutas

app.use('/api/auth', authRoutes);

app.use('/api', transactionRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
