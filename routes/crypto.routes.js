const express = require('express');
const { getCryptoCurrencies, convertCryptoCurrencies } = require('../controllers/crypto.controller');

const router = express.Router();

router.get("/cryptocurrencies" ,getCryptoCurrencies);
router.post("/convert" ,convertCryptoCurrencies);

module.exports = router;