require('dotenv').config({ path: './.env' });

const express = require("express")
const router = require('./routes/index')
const app = express()
const PORT = process.env.PORT || 4040

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))