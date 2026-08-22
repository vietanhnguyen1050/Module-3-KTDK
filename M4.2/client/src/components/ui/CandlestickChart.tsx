import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ICandle } from '../../types';
import { BarChart2, TrendingUp, RefreshCw } from 'lucide-react';

export const CandlestickChart: React.FC<{ symbol: string; currentPrice?: number }> = ({ symbol, currentPrice }) => {
  const [candles, setCandles] = useState<ICandle[]>([]);
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandles();
  }, [symbol]);

  const fetchCandles = async () => {
    setLoading(true);
    const res = await api.getCandles(symbol.replace('/', '-'));
    if (res.success && res.data) {
      setCandles(res.data);
    }
    setLoading(false);
  };

  const maxPrice = candles.length ? Math.max(...candles.map(c => c.high)) * 1.002 : 100;
  const minPrice = candles.length ? Math.min(...candles.map(c => c.low)) * 0.998 : 0;
  const range = maxPrice - minPrice || 1;

  const getY = (val: number) => 240 - ((val - minPrice) / range) * 200;

  return (
    <div className="card" style={{ padding: 18, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{symbol}</h3>
          {currentPrice && (
            <span className="price-up" style={{ fontSize: 18, fontWeight: 800 }}>
              ${currentPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['15M', '1H', '4H', '1D', '1W'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: timeframe === tf ? 'var(--primary)' : 'var(--bg-elevated)',
                color: timeframe === tf ? '#000' : 'var(--text-muted)'
              }}
            >
              {tf}
            </button>
          ))}
          <button onClick={fetchCandles} style={{ color: 'var(--text-muted)', marginLeft: 8 }} title="Làm mới biểu đồ">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Candlestick Canvas */}
      <div style={{ flex: 1, minHeight: 280, position: 'relative' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Đang tải biểu đồ nến...</div>
        ) : (
          <svg viewBox="0 0 700 280" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Horizontal Grid lines & Price scale */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const priceLevel = minPrice + range * pct;
              const y = getY(priceLevel);
              return (
                <g key={i}>
                  <line x1="0" y1={y} x2="630" y2={y} stroke="#1e2430" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="640" y={y + 4} fill="#848e9c" fontSize="10" fontFamily="var(--font-mono)">
                    ${priceLevel.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Candlesticks */}
            {candles.map((c, idx) => {
              const x = idx * (600 / candles.length) + 25;
              const isUp = c.close >= c.open;
              const color = isUp ? 'var(--buy)' : 'var(--sell)';
              const candleWidth = 14;

              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);

              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(openY - closeY), 2);

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line x1={x + candleWidth / 2} y1={highY} x2={x + candleWidth / 2} y2={lowY} stroke={color} strokeWidth="1.5" />
                  {/* Body */}
                  <rect x={x} y={bodyY} width={candleWidth} height={bodyHeight} fill={color} rx="1" />
                  {/* Time label */}
                  {idx % 2 === 0 && (
                    <text x={x + candleWidth / 2} y="270" textAnchor="middle" fill="#848e9c" fontSize="10">
                      {c.time}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};
