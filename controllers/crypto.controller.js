const axios = require('axios');


// Fetch top 100 cryptocurrencies and supported currencies
exports.getCryptoCurrencies = async (req, res) => {
    
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd', 
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        return res.status(200).json({
            success: true,
            message: "Cryptocurrencies and supported currencies fetched successfully",
            data: response.data 
          });
};

// Convert cryptocurrency to a selected currency
exports.convertCryptoCurrencies = async (req, res) => {
    const { sourceCrypto, amount, targetCurrency } = req.body;

    if (!sourceCrypto || !amount || !targetCurrency)
    return res.status(400).json({
      message:
        "Please enter all field (sourceCrypto, amount, targetCurrency)",
    });

    
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: sourceCrypto,
          vs_currencies: targetCurrency,
        },
      });
  
      const data = response.data;
  
      if (!data || !data[sourceCrypto]) {
        return res.status(404).json({ message: "Cryptocurrency not found" });
      }
  
      const rate = data[sourceCrypto][targetCurrency];
      if (!rate) {
        return res.status(404).json({ message: "Target currency not supported" });
      }
  
      const convertedAmount = amount * rate;

      return res.status(200).json({
        success: true,
        message: "cryptoCurrency converted successfully",
        sourceCrypto, 
        amount, 
        targetCurrency, 
        convertedAmount
      });  
};