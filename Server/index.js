const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const db = require('./db');

const tourRoutes = require('./routes/tourRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use('/tours', tourRoutes);

const port = process.env.port || 3000;
app.listen(port, ()=>console.log(`Server running on ${port}`));