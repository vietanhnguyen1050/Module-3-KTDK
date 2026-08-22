import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ITradingPair, IOrder } from '../../types';
import { CandlestickChart } from '../../components/ui/CandlestickChart';
import { OrderBookWidget } from '../../components/ui/OrderBookWidget';
import { TradeForm } from '../../components/ui/TradeForm';
import { Trash2, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

export const SpotTrading: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pairSymbol = searchParams.get('pair') || 'BTC/USDT';

  const [pairs, setPairs] = useState<ITradingPair[]>([]);
  const [currentPair, setCurrentPair] = useState<ITradingPair | null>(null);
  const [openOrders, setOpenOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    fetchPairs();
    fetchOrders();
  }, [pairSymbol]);

  const fetchPairs = async () => {
    const res = await api.getPairs();
    if (res.success && res.data) {
      setPairs(res.data);
      const matched = res.data.find((p: ITradingPair) => p.symbol === pairSymbol) || res.data[0];
      setCurrentPair(matched);
    }
  };

  const fetchOrders = async () => {
    const res = await api.getMyOrders();
    if (res.success && res.data) {
      setOpenOrders(res.data.filter((o: IOrder) => o.status === 'pending'));
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Hủy lệnh giao dịch này (TRD-TRD04)?')) return;
    const res = await api.cancelOrder(orderId);
    if (res.success) {
      fetchOrders();
    }
  };

  return (
    <div>
      {/* Top Ticker Header */}
      {currentPair && (
        <div className="card" style={{ padding: '12px 18px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <select
              className="form-select"
              style={{ width: 140, fontWeight: 800, fontSize: 15 }}
              value={currentPair.symbol}
              onChange={(e) => setSearchParams({ pair: e.target.value })}
            >
              {pairs.map(p => (
                <option key={p.id} value={p.symbol}>{p.symbol}</option>
              ))}
            </select>

            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Giá Giao Ngay</div>
              <div className="price-up" style={{ fontSize: 18, fontWeight: 800 }}>
                ${currentPair.lastPrice.toLocaleString()}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Biến Động 24h</div>
              <div className={currentPair.change24h >= 0 ? 'price-up' : 'price-down'} style={{ fontSize: 14, fontWeight: 700 }}>
                {currentPair.change24h >= 0 ? `+${currentPair.change24h}%` : `${currentPair.change24h}%`}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cao / Thấp 24h</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                ${currentPair.high24h.toLocaleString()} / ${currentPair.low24h.toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-primary">Spot 0.1% Maker / 0.15% Taker</span>
          </div>
        </div>
      )}

      {/* Terminal 3-Columns Grid */}
      <div className="terminal-grid" style={{ marginBottom: 16 }}>
        {/* Col 1: Order Book */}
        <div style={{ height: 500 }}>
          {currentPair && <OrderBookWidget symbol={currentPair.symbol} />}
        </div>

        {/* Col 2: Chart */}
        <div style={{ height: 500 }}>
          {currentPair && (
            <CandlestickChart symbol={currentPair.symbol} currentPrice={currentPair.lastPrice} />
          )}
        </div>

        {/* Col 3: Buy / Sell Form */}
        <div>
          {currentPair && (
            <TradeForm
              symbol={currentPair.symbol}
              currentPrice={currentPair.lastPrice}
              onTradeSuccess={fetchOrders}
            />
          )}
        </div>
      </div>

      {/* Bottom: Open Orders (TRD-TRD04) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800 }}>Lệnh Chờ Khớp Của Bạn (Open Orders - TRD-TRD04)</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{openOrders.length} lệnh chờ</span>
        </div>

        {openOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Cặp giao dịch</th>
                  <th>Loại lệnh</th>
                  <th>Mua/Bán</th>
                  <th>Giá đặt</th>
                  <th>Số lượng</th>
                  <th>Tổng giá trị</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {openOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(ord.createdAt).toLocaleTimeString('vi-VN')}</td>
                    <td><strong>{ord.symbol}</strong></td>
                    <td><code style={{ textTransform: 'uppercase' }}>{ord.type}</code></td>
                    <td>
                      <span className={ord.side === 'buy' ? 'badge badge-buy' : 'badge badge-sell'}>
                        {ord.side === 'buy' ? 'MUA' : 'BÁN'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.price.toLocaleString()}</td>
                    <td>{ord.amount}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${ord.totalValue.toLocaleString()} USDT</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleCancelOrder(ord.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '3px 8px' }}
                      >
                        <Trash2 size={12} /> Hủy lệnh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Không có lệnh nào đang chờ khớp.
          </div>
        )}
      </div>
    </div>
  );
};
