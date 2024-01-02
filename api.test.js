const axios = require('axios');
const app = require('./index'); 
const supertest = require('supertest');

describe('GET /cryptocurrencies endpoint', () => {
  it('should return a list of cryptocurrencies', async () => {
    const response = await supertest(app).get('/cryptocurrencies');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('length');
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    // Mocking axios.get to simulate an error
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('API error'));

    const response = await supertest(app).get('/cryptocurrencies');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'API error');
  });
});


describe('POST /convert endpoint', () => {
    it('should convert cryptocurrency to the target currency', async () => {
      const mockReqBody = {
        sourceCrypto: 'bitcoin',
        amount: 1, 
        targetCurrency: 'usd',
      };
  
      // Mocking the Coingecko API call
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          bitcoin: {
            usd: 45000, 
          },
        },
      });
  
      const response = await supertest(app)
        .post('/convert')
        .send(mockReqBody);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sourceCrypto', 'bitcoin');
      expect(response.body).toHaveProperty('amount', 1);
      expect(response.body).toHaveProperty('targetCurrency', 'usd');
      expect(response.body).toHaveProperty('convertedAmount', 45000); 
    });
  
    it('should handle errors gracefully', async () => {
      // Simulating an error in the Coingecko API call
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('API error'));
  
      const mockReqBody = {
        sourceCrypto: 'bitcoin',
        amount: 1,
        targetCurrency: 'usd',
      };
  
      const response = await supertest(app)
        .post('/convert')
        .send(mockReqBody);
  
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'API error');
    });
  });
  
