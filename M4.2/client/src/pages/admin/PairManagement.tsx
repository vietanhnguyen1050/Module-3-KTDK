import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ITradingPair } from '../../types';
import { Tag, Plus, Edit2, Trash2, CheckCircle, Percent } from 'lucide-react';

export const PairManagement: React.FC = () => {
  const [pairs, setPairs] = useState<ITradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPair, setEditingPair] = useState<ITradingPair | null>(null);

  const [formData, setFormData] = useState({
    symbol: '',
    baseAsset: '',
    quoteAsset: 'USDT',
    lastPrice: 1.0,
    makerFee: 0.001,
    takerFee: 0.0015,
    minTradeAmount: 0.01,
    status: 'active' as any
  });

  useEffect(() => {
    fetchPairs();
  }, []);

  const fetchPairs = async () => {
    setLoading(true);
    const res = await api.getPairs();
    if (res.success && res.data) setPairs(res.data);
    setLoading(false);
  };

  const handleOpenModal = (p?: ITradingPair) => {
    if (p) {
      setEditingPair(p);
      setFormData({
        symbol: p.symbol,
        baseAsset: p.baseAsset,
        quoteAsset: p.quoteAsset,
        lastPrice: p.lastPrice,
        makerFee: p.makerFee,
        takerFee: p.takerFee,
        minTradeAmount: p.minTradeAmount,
        status: p.status
      });
    } else {
      setEditingPair(null);
      setFormData({
        symbol: 'AVAX/USDT',
        baseAsset: 'AVAX',
        quoteAsset: 'USDT',
        lastPrice: 35.0,
        makerFee: 0.001,
        takerFee: 0.0015,
        minTradeAmount: 0.1,
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPair) {
      await api.updateAdminPair(editingPair.id, formData);
    } else {
      await api.createAdminPair(formData);
    }
    setShowModal(false);
    fetchPairs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hủy niêm yết (Delist) cặp giao dịch này khỏi sàn?')) return;
    await api.deleteAdminPair(id);
    fetchPairs();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Quản Lý Cặp Giao Dịch & Biểu Phí Sàn (AD-ADM04 / AD-ADM11)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Niêm yết cặp coin mới, tạm ngừng bảo trì và cấu hình biểu phí Maker / Taker
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Niêm Yết Cặp Coin Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách cặp giao dịch...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cặp Giao Dịch</th>
                  <th>Giá Hiện Tại</th>
                  <th>Maker Fee (Phí tạo lập)</th>
                  <th>Taker Fee (Phí khớp ngay)</th>
                  <th>Min Trade Amount</th>
                  <th>Khối lượng 24h</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag size={16} color="var(--primary)" />
                        <strong style={{ fontSize: 14 }}>{p.symbol}</strong>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${p.lastPrice.toLocaleString()}</td>
                    <td><span className="badge badge-primary">{(p.makerFee * 100).toFixed(2)}%</span></td>
                    <td><span className="badge badge-secondary">{(p.takerFee * 100).toFixed(2)}%</span></td>
                    <td>{p.minTradeAmount} {p.baseAsset}</td>
                    <td style={{ color: 'var(--text-muted)' }}>${(p.volume24h / 1e6).toFixed(1)}M</td>
                    <td>
                      {p.status === 'active' && <span className="badge badge-buy">ĐANG GIAO DỊCH</span>}
                      {p.status === 'maintenance' && <span className="badge badge-primary">BẢO TRÌ</span>}
                      {p.status === 'delisted' && <span className="badge badge-sell">HỦY NIÊM YẾT</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleOpenModal(p)} className="btn btn-secondary btn-sm">
                          <Edit2 size={12} /> Sửa Phí
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editingPair ? 'Chỉnh Sửa Cặp Giao Dịch & Biểu Phí' : 'Niêm Yết Cặp Coin Mới'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Ký hiệu cặp (VD: AVAX/USDT) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Base Asset (VD: AVAX)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.baseAsset}
                    onChange={(e) => setFormData({ ...formData, baseAsset: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quote Asset</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.quoteAsset}
                    onChange={(e) => setFormData({ ...formData, quoteAsset: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Phí Maker (Tạo lập)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="form-input"
                    value={formData.makerFee}
                    onChange={(e) => setFormData({ ...formData, makerFee: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phí Taker (Khớp ngay)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="form-input"
                    value={formData.takerFee}
                    onChange={(e) => setFormData({ ...formData, takerFee: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái cặp</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Hoạt động (Active Trading)</option>
                  <option value="maintenance">Tạm bảo trì (Maintenance)</option>
                  <option value="delisted">Đã hủy niêm yết (Delisted)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editingPair ? 'Lưu Cấu Hình' : 'Niêm Yết Cặp'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
