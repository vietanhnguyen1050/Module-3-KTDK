import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IOrderBookEntry } from '../../types';

export const OrderBookWidget: React.FC<{ symbol: string; onSelectPrice?: (price: number) => void }> = ({ symbol, onSelectPrice }) => {
  const [asks, setAsks] = useState<IOrderBookEntry[]>([]);
  const [bids, setBids] = useState<IOrderBookEntry[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  const fetchOrderBook = async () => {
    const res = await api.getOrderBook(symbol.replace('/', '-'));
    if (res.success && res.data) {
      setAsks(res.data.asks || []);
      setBids(res.data.bids || []);
      setCurrentPrice(res.data.currentPrice || 0);
    }
  };

  const baseAsset = symbol.split('/')[0];

  return (
    <div className="card" style={{ padding: 14, fontSize: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span>Sổ Lệnh (Order Book)</span>
        <span style={{ color: 'var(--text-muted)' }}>Thời gian thực</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>
        <span>Giá (USDT)</span>
        <span style={{ textAlign: 'right' }}>Số lượng ({baseAsset})</span>
        <span style={{ textAlign: 'right' }}>Tổng (USDT)</span>
      </div>

      {/* Asks (Sell orders - Red) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {asks.slice(0, 6).map((ask, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(ask.price)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              fontFamily: 'var(--font-mono)', cursor: 'pointer', padding: '2px 0'
            }}
          >
            <span className="price-down">${ask.price.toLocaleString()}</span>
            <span style={{ textAlign: 'right' }}>{ask.amount}</span>
            <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{ask.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Current Spread Price */}
      <div style={{
        margin: '8px 0', padding: '6px 10px', background: 'var(--bg-elevated)',
        borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span className="price-up" style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
          ${currentPrice.toLocaleString()}
        </span>
        <span style={{ fontSize: 11, color: 'var(--buy)' }}>↑ Tỷ giá gần nhất</span>
      </div>

      {/* Bids (Buy orders - Green) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {bids.slice(0, 6).map((bid, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(bid.price)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              fontFamily: 'var(--font-mono)', cursor: 'pointer', padding: '2px 0'
            }}
          >
            <span className="price-up">${bid.price.toLocaleString()}</span>
            <span style={{ textAlign: 'right' }}>{bid.amount}</span>
            <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{bid.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
