import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPromotion } from '../../types';
import { Gift, Plus, Trash2, Edit2, Sparkles } from 'lucide-react';

export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rewardText: '',
    code: '',
    type: 'fee_discount' as any,
    startDate: '2024-02-01',
    endDate: '2024-12-31'
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    const res = await api.getPromotions();
    if (res.success && res.data) setPromotions(res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createPromotion(formData);
    setShowModal(false);
    fetchPromos();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa chương trình khuyến mãi này?')) return;
    await api.deletePromotion(id);
    fetchPromos();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Quản Lý Chương Trình Khuyến Mãi & Airdrop (AD-ADM12)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Tạo các chiến dịch Airdrop, voucher giảm phí giao dịch và sự kiện cho trader
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Tạo Chiến Dịch Mới (AD-ADM12)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải khuyến mãi...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Chương Trình</th>
                  <th>Phần Thưởng</th>
                  <th>Mã Voucher</th>
                  <th>Loại</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td><strong style={{ color: 'var(--primary)' }}>{p.rewardText}</strong></td>
                    <td><code>{p.code}</code></td>
                    <td><span className="badge badge-primary">{p.type.toUpperCase()}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.startDate}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.endDate}</td>
                    <td><span className="badge badge-buy">ĐANG DIỄN RA</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
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
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Tạo Chương Trình Ưu Đãi Mới</h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Tiêu đề chương trình *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Phần thưởng (Reward text)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: 50 USDT"
                    value={formData.rewardText}
                    onChange={(e) => setFormData({ ...formData, rewardText: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mã Code Claim</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: BONUS2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả chương trình</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Tạo Khuyến Mãi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
