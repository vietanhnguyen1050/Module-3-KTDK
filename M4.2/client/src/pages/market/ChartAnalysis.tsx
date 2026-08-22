import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ITradingPair } from '../../types';
import { CandlestickChart } from '../../components/ui/CandlestickChart';
import { BarChart2, TrendingUp, ArrowRight } from 'lucide-react';

export const ChartAnalysis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const symbolParam = searchParams.get('symbol') || 'BTC/USDT';
  const [pairs, setPairs] = useState<ITradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<ITradingPair | null>(null);

  useEffect(() => {
    api.getPairs().then(res => {
      if (res.success && res.data) {
        setPairs(res.data);
        const current = res.data.find((p: ITradingPair) => p.symbol === symbolParam) || res.data[0];
        setSelectedPair(current);
      }
    });
  }, [symbolParam]);

  const handleSelect = (sym: string) => {
    setSearchParams({ symbol: sym });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Biểu Đồ Phân Tích Kỹ Thuật (TRD-CHRT01 / VWR-CHRT01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Trực quan hóa biến động giá nến Candlestick thời gian thực, hỗ trợ phân tích đa khung thời gian
          </p>
        </div>

        {selectedPair && (
          <Link to={`/trade?pair=${selectedPair.symbol}`} className="btn btn-primary">
            Đi đến giao dịch {selectedPair.symbol} <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
        {/* Pair selector */}
        <div className="card" style={{ padding: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Cặp Tiền Tệ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pairs.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.symbol)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', borderRadius: 6, fontSize: 12,
                  background: (selectedPair?.symbol === p.symbol) ? 'var(--primary-light)' : 'transparent',
                  color: (selectedPair?.symbol === p.symbol) ? 'var(--primary)' : 'var(--text-main)'
                }}
              >
                <strong>{p.symbol}</strong>
                <span className={p.change24h >= 0 ? 'price-up' : 'price-down'}>
                  ${p.lastPrice.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Chart Area */}
        <div style={{ height: 500 }}>
          {selectedPair && (
            <CandlestickChart symbol={selectedPair.symbol} currentPrice={selectedPair.lastPrice} />
          )}
        </div>
      </div>
    </div>
  );
};
