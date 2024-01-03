const axios = require('axios');
const { getCryptoCurrencies, convertCryptoCurrencies } = require('./controllers/crypto.controller'); 

jest.mock('axios');

describe('getCryptoCurrencies', () => {
  test('should fetch top 100 cryptocurrencies and supported currencies', async () => {
    const mockResponse = {
      data: [ ],
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCryptoCurrencies(mockReq, mockRes);

    expect(axios.get).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Cryptocurrencies and supported currencies fetched successfully',
      data: mockResponse.data,
    });
  });
});

describe('convertCryptoCurrencies', () => {
  test('should convert cryptocurrency to a selected currency', async () => {
    const mockReq = {
      body: {
        sourceCrypto: 'bitcoin',
        amount: 1,
        targetCurrency: 'usd',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockResponse = {
      data: {
        bitcoin: {
          usd: 10000, 
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    await convertCryptoCurrencies(mockReq, mockRes);

    expect(axios.get).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
      },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'cryptoCurrency converted successfully',
      sourceCrypto: 'bitcoin',
      amount: 1,
      targetCurrency: 'usd',
      convertedAmount: 10000, 
    });
  });

  test('should handle missing fields', async () => {
    const mockReq = {
      body: {
        
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await convertCryptoCurrencies(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Please enter all field (sourceCrypto, amount, targetCurrency)',
    });
  });

});
