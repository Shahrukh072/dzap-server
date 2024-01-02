const express = require('express');
const PORT = process.env.PORT || 4040;
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());


// Fetch top 100 cryptocurrencies and supported currencies
app.get('/cryptocurrencies', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd', 
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert cryptocurrency to a selected currency
app.post('/convert', async (req, res) => {
  const { sourceCrypto, amount, targetCurrency } = req.body;

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: sourceCrypto,
        vs_currencies: targetCurrency,
      },
    });

    const data = response.data;

    if (!data || !data[sourceCrypto]) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }

    const rate = data[sourceCrypto][targetCurrency];
    if (!rate) {
      return res.status(404).json({ error: 'Target currency not supported' });
    }

    const convertedAmount = amount * rate;
    res.json({ sourceCrypto, amount, targetCurrency, convertedAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
    res.send("Hey, server is runnning ")
  })


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;