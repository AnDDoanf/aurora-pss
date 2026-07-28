import axios from 'axios';

const PIXYSHIP_BASE = 'https://pixyship.com/api';

export const getDailyOffers = async () => {
  try {
    const response = await axios.get(`${PIXYSHIP_BASE}/dailyoffer`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch daily offers from pixyship.com:", err);
    return null;
  }
};

export const getMarketPrices = async () => {
  try {
    const response = await axios.get(`${PIXYSHIP_BASE}/market`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch market prices from pixyship.com:", err);
    return null;
  }
};

export const getTournamentStandings = async () => {
  try {
    const response = await axios.get(`${PIXYSHIP_BASE}/tournaments`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tournament standings from pixyship.com:", err);
    return null;
  }
};
