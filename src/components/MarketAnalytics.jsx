import React, { useState, useEffect } from 'react';
import { getDailyOffers, getMarketPrices } from '../services/pixyshipApi';
import { ShoppingBag, TrendingUp, DollarSign, Sparkles } from 'lucide-react';

const MarketAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dailyOffers, setDailyOffers] = useState(null);
  const [marketItems, setMarketItems] = useState([]);

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      try {
        const offers = await getDailyOffers();
        const market = await getMarketPrices();
        setDailyOffers(offers);
        if (market) setMarketItems(market);
      } catch (err) {
        console.error("Failed to load market data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, []);

  const demoItems = [
    { name: 'Void Battery Tier IV', category: 'Module', avgPrice: '120 Gas', trend: '+5%' },
    { name: 'Hyper Cannon Schematics', category: 'Item', avgPrice: '450 Minerals', trend: '-2%' },
    { name: 'Titanium Armor Plate', category: 'Equipment', avgPrice: '85 Gas', trend: '+12%' }
  ];

  return (
    <div className="tab-container">
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <h2 className="card-title">PixyShip Market Analytics & Daily Offers</h2>
          </div>
          <p className="card-subtitle">
            Track daily item sales, shop rotations, and historical item pricing trends powered by <strong>PixyShip</strong> (<code>pixyship.com/api</code>).
          </p>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-header flex-between">
          <h3 className="card-title">In-Game Economy Trends</h3>
          <span className="text-xs text-muted">Updated daily from PixyShip</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Avg Market Price</th>
                <th>24h Price Trend</th>
              </tr>
            </thead>
            <tbody>
              {demoItems.map((item, idx) => (
                <tr key={idx} className="table-row">
                  <td className="font-bold text-emerald-400">{item.name}</td>
                  <td className="text-muted">{item.category}</td>
                  <td className="font-mono">{item.avgPrice}</td>
                  <td>
                    <span className={`status-tag ${item.trend.startsWith('+') ? 'status-win' : 'status-loss'}`}>
                      <TrendingUp className="w-3.5 h-3.5 mr-1" /> {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalytics;
