import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ArrowLeftRight, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface TradeFormProps {
  symbol: string;
  currentPrice: number;
  onTradeSuccess?: () => void;
}

export const TradeForm: React.FC<TradeFormProps> = ({ symbol, currentPrice, onTradeSuccess }) => {
  const [tab, setTab] = useState<'spot' | 'swap'>('spot');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');

  // Spot Order form
  const [price, setPrice] = useState<number>(currentPrice || 0);
  const [amount, setAmount] = useState<string>('0.1');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Swap form
  const [fromSymbol, setFromSymbol] = useState('USDT');
  const [toSymbol, setToSymbol] = useState('BTC');
  const [swapAmount, setSwapAmount] = useState('1000');

  useEffect(() => {
    if (currentPrice && orderType === 'limit' && price === 0) {
      setPrice(currentPrice);
    }
  }, [currentPrice]);

  const baseAsset = symbol.split('/')[0];
  const quoteAsset = symbol.split('/')[1] || 'USDT';

  const handleSpotOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.placeOrder({
      symbol,
      type: orderType,
      side,
      price: orderType === 'limit' ? Number(price) : undefined,
      amount: Number(amount)
    });

    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: res.message || 'Đặt lệnh thành công!' });
      if (onTradeSuccess) onTradeSuccess();
    } else {
      setMsg({ type: 'error', text: res.message || 'Đặt lệnh thất bại.' });
    }
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await api.swapCrypto({
      fromSymbol,
      toSymbol,
      amount: Number(swapAmount)
    });

    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: res.message || 'Swap thành công!' });
      if (onTradeSuccess) onTradeSuccess();
    } else {
      setMsg({ type: 'error', text: res.message || 'Swap thất bại.' });
    }
  };

  const totalValue = (orderType === 'limit' ? price : currentPrice) * (Number(amount) || 0);

  return (
    <div className="card" style={{ padding: 18 }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: 'var(--bg-dark)', padding: 4, borderRadius: 6 }}>
        <button
          onClick={() => setTab('spot')}
          style={{
            flex: 1, padding: '6px 0', borderRadius: 4, fontSize: 12, fontWeight: 700,
            background: tab === 'spot' ? 'var(--bg-elevated)' : 'transparent',
            color: tab === 'spot' ? 'var(--text-main)' : 'var(--text-muted)'
          }}
        >
          Giao Dịch Spot (TRD-TRD01/02)
        </button>
        <button
          onClick={() => setTab('swap')}
          style={{
            flex: 1, padding: '6px 0', borderRadius: 4, fontSize: 12, fontWeight: 700,
            background: tab === 'swap' ? 'var(--bg-elevated)' : 'transparent',
            color: tab === 'swap' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Swap Tức Thời (TRD-TRD03)
        </button>
      </div>

      {msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
          borderRadius: 4, fontSize: 12, marginBottom: 12,
          background: msg.type === 'success' ? 'var(--buy-light)' : 'var(--sell-light)',
          color: msg.type === 'success' ? 'var(--buy)' : 'var(--sell)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span>{msg.text}</span>
        </div>
      )}

      {tab === 'spot' ? (
        <div>
          {/* Buy / Sell switch */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`btn ${side === 'buy' ? 'btn-buy' : 'btn-secondary'}`}
              style={{ padding: '8px 0' }}
            >
              MUA {baseAsset}
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`btn ${side === 'sell' ? 'btn-sell' : 'btn-secondary'}`}
              style={{ padding: '8px 0' }}
            >
              BÁN {baseAsset}
            </button>
          </div>

          {/* Order Type */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input
                type="radio"
                name="orderType"
                checked={orderType === 'limit'}
                onChange={() => setOrderType('limit')}
              />
              <span>Lệnh Giới Hạn (Limit)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input
                type="radio"
                name="orderType"
                checked={orderType === 'market'}
                onChange={() => setOrderType('market')}
              />
              <span>Lệnh Thị Trường (Market)</span>
            </label>
          </div>

          <form onSubmit={handleSpotOrder}>
            {orderType === 'limit' ? (
              <div className="form-group">
                <label className="form-label">Giá đặt mua/bán (USDT)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Giá thị trường tốt nhất</label>
                <div style={{ padding: '10px 12px', background: 'var(--bg-dark)', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  Khớp ngay tại giá tốt nhất hiện tại (~${currentPrice.toLocaleString()})
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Số lượng {baseAsset}</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Quick % buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 16 }}>
              {['25%', '50%', '75%', '100%'].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => setAmount((0.25 * parseInt(pct) / 25).toFixed(2))}
                  style={{
                    padding: '3px 0', fontSize: 10, background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)', borderRadius: 4
                  }}
                >
                  {pct}
                </button>
              ))}
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 6, marginBottom: 16, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Ước tính giá trị:</span>
                <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  ${totalValue.toLocaleString()} USDT
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 4 }}>
                <span>Phí giao dịch (0.1%):</span>
                <span>${(totalValue * 0.001).toFixed(4)} USDT</span>
              </div>
            </div>

            <button
              type="submit"
              className={`btn ${side === 'buy' ? 'btn-buy' : 'btn-sell'} btn-lg`}
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Đang gửi lệnh...' : `${side === 'buy' ? 'MUA NGAY' : 'BÁN NGAY'} ${baseAsset}`}
            </button>
          </form>
        </div>
      ) : (
        /* Instant Swap Form (TRD-TRD03) */
        <form onSubmit={handleSwap}>
          <div className="form-group">
            <label className="form-label">Từ đồng coin (From)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 6 }}>
              <input
                type="number"
                step="any"
                className="form-input"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                required
              />
              <select className="form-select" value={fromSymbol} onChange={(e) => setFromSymbol(e.target.value)}>
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
                <option value="BNB">BNB</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <ArrowLeftRight size={16} color="var(--primary)" />
          </div>

          <div className="form-group">
            <label className="form-label">Sang đồng coin nhận (To)</label>
            <select className="form-select" value={toSymbol} onChange={(e) => setToSymbol(e.target.value)}>
              <option value="BTC">BTC (Bitcoin)</option>
              <option value="ETH">ETH (Ethereum)</option>
              <option value="SOL">SOL (Solana)</option>
              <option value="BNB">BNB (BNB Chain)</option>
              <option value="USDT">USDT (Tether)</option>
            </select>
          </div>

          <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 6, marginBottom: 16, fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Tỷ giá hoán đổi: </span>
            <strong style={{ color: 'var(--buy)' }}>Realtime Oracle Rate (0.2% Fee)</strong>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            <Zap size={16} />
            <span>{loading ? 'Đang hoán đổi...' : 'Hoán Đổi Tức Thời (Swap)'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
