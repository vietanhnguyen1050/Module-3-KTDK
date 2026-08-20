import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IDiscountCode } from '../../types';
import { Plus, Edit2, Trash2, Tag, CheckCircle, XCircle } from 'lucide-react';

export const DiscountManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<IDiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IDiscountCode | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 20,
    maxUses: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2024-12-31',
    isActive: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    const res = await api.getDiscounts();
    if (res.success && res.data) {
      setDiscounts(res.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: IDiscountCode) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code,
        discountPercent: item.discountPercent,
        maxUses: item.maxUses,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        code: `DISC${Math.floor(1000 + Math.random() * 9000)}`,
        discountPercent: 20,
        maxUses: 50,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2024-12-31',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await api.updateDiscount(editingItem.id, formData);
    } else {
      await api.createDiscount(formData);
    }
    setShowModal(false);
    fetchDiscounts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này (IN-UĐ03)?')) return;
    await api.deleteDiscount(id);
    fetchDiscounts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Mã Giảm Giá (IN-UĐ01 / 02 / 03)</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
          <Plus size={16} /> Tạo Mã Giảm Giá Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã code</th>
                  <th>Mức giảm</th>
                  <th>Lượt sử dụng</th>
                  <th>Thời hạn</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag size={16} color="var(--primary)" />
                        <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, fontWeight: 800, color: 'var(--primary)' }}>
                          {item.code}
                        </code>
                      </div>
                    </td>
                    <td><strong style={{ color: 'var(--danger)' }}>-{item.discountPercent}%</strong></td>
                    <td>{item.usedCount} / {item.maxUses}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.startDate} đến {item.endDate}</td>
                    <td>
                      {item.isActive ? (
                        <span className="badge badge-success"><CheckCircle size={12} /> Đang hoạt động</span>
                      ) : (
                        <span className="badge badge-danger"><XCircle size={12} /> Tạm dừng</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleOpenModal(item)} className="btn btn-secondary btn-sm" title="Chỉnh sửa (IN-UĐ02)">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Xóa (IN-UĐ03)">
                          <Trash2 size={14} />
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
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editingItem ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mã Code (Chữ in hoa) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Phần trăm giảm (%) *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className="form-input"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượt tối đa *</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Kích hoạt mã giảm giá này</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Lưu Thay Đổi' : 'Tạo Mã Giảm Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
