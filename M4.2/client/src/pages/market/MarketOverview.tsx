import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ICoin, ITradingPair } from '../../types';
import { Globe, TrendingUp, TrendingDown, Search, ArrowRight } from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [pairs, setPairs] = useState<ITradingPair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    const [cRes, pRes] = await Promise.all([
      api.getCoins(),
      api.getPairs()
    ]);
    if (cRes.success && cRes.data) setCoins(cRes.data);
    if (pRes.success && pRes.data) setPairs(pRes.data);
    setLoading(false);
  };

  const filteredCoins = coins.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Title & Stats */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Tổng Quan Thị Trường Tiền Điện Tử (VWR-VEW01)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          Theo dõi giá, khối lượng 24h và biến động trực tiếp của các đồng tiền mã hóa hàng đầu
        </p>
      </div>

      {/* Market Tickers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {coins.slice(0, 4).map((coin) => (
          <div key={coin.symbol} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={coin.icon} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <strong style={{ fontSize: 14 }}>{coin.symbol}/USDT</strong>
              </div>
              <span className={coin.change24h >= 0 ? 'badge badge-buy' : 'badge badge-sell'}>
                {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
              </span>
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              ${coin.currentPrice.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Vol 24h: ${(coin.volume24h / 1e9).toFixed(2)}B
            </div>
          </div>
        ))}
      </div>

      {/* Main Coins Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Tất Cả Đồng Coin (Spot Market)</h3>
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm BTC, ETH, SOL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 30, height: 34, fontSize: 12 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải giá thị trường...</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Coin</th>
                  <th>Giá Hiện Tại</th>
                  <th>Biến Động 24h</th>
                  <th>Cao Nhất 24h</th>
                  <th>Thấp Nhất 24h</th>
                  <th>Khối Lượng 24h</th>
                  <th>Vốn Hóa Thị Trường</th>
                  <th style={{ textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((c) => (
                  <tr key={c.symbol}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={c.icon} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                        <div>
                          <strong>{c.name}</strong>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{c.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td><strong style={{ fontFamily: 'var(--font-mono)' }}>${c.currentPrice.toLocaleString()}</strong></td>
                    <td>
                      <span className={c.change24h >= 0 ? 'price-up' : 'price-down'}>
                        {c.change24h >= 0 ? `+${c.change24h}%` : `${c.change24h}%`}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${c.high24h.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${c.low24h.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)' }}>${(c.volume24h / 1e6).toFixed(1)}M</td>
                    <td style={{ color: 'var(--text-muted)' }}>${(c.marketCap / 1e9).toFixed(1)}B</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link to={`/chart?symbol=${c.symbol}/USDT`} className="btn btn-secondary btn-sm" title="Xem biểu đồ">
                          Biểu đồ
                        </Link>
                        <Link to={`/trade?pair=${c.symbol}/USDT`} className="btn btn-primary btn-sm">
                          Giao dịch <ArrowRight size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
