import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPriceAlert } from '../../types';
import { Bell, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<IPriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    symbol: 'BTC/USDT',
    targetPrice: 70000,
    condition: '>=' as '>=' | '<='
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    const res = await api.getAlerts();
    if (res.success && res.data) setAlerts(res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createAlert(formData);
    setShowModal(false);
    fetchAlerts();
  };

  const handleDelete = async (id: string) => {
    await api.deleteAlert(id);
    fetchAlerts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Cảnh Báo Biến Động Giá (TRD-ALRT01 / VWR-ALRT01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Cài đặt ngưỡng giá mục tiêu và nhận thông báo khi thị trường chạm mốc kỳ vọng
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Đặt Cảnh Báo Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách cảnh báo...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cặp giao dịch</th>
                  <th>Điều kiện kích hoạt</th>
                  <th>Giá mục tiêu (Target)</th>
                  <th>Giá hiện tại</th>
                  <th>Trạng thái</th>
                  <th>Thời gian đặt</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alt) => (
                  <tr key={alt.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bell size={16} color="var(--primary)" />
                        <strong>{alt.symbol}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{alt.condition === '>=' ? 'Lớn hơn hoặc bằng' : 'Nhỏ hơn hoặc bằng'}</span>
                    </td>
                    <td><strong style={{ fontFamily: 'var(--font-mono)' }}>${alt.targetPrice.toLocaleString()}</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${alt.currentPrice.toLocaleString()}</td>
                    <td>
                      {alt.status === 'triggered' ? (
                        <span className="badge badge-buy"><CheckCircle size={11} /> Đã Kích Hoạt</span>
                      ) : (
                        <span className="badge badge-primary">Đang Giám Sát</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(alt.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(alt.id)} className="btn btn-danger btn-sm">
                        <Trash2 size={12} />
                      </button>
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
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Đặt Cảnh Báo Giá Tự Động</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Chọn cặp giao dịch</label>
                <select
                  className="form-select"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="BNB/USDT">BNB/USDT</option>
                  <option value="XRP/USDT">XRP/USDT</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Điều kiện</label>
                <select
                  className="form-select"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                >
                  <option value=">=">Giá tăng vượt hoặc bằng (&gt;=)</option>
                  <option value="<=">Giá giảm chạm hoặc bằng (&lt;=)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mức giá mục tiêu (USDT) *</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Kích Hoạt Cảnh Báo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
