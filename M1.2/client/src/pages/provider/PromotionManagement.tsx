import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPromotion, ICourse } from '../../types';
import { Plus, Edit2, Trash2, Sparkles, Clock, CheckCircle } from 'lucide-react';

export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IPromotion | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    type: 'time_based' as 'time_based' | 'quantity_based',
    discountValue: 30,
    targetQuantity: 50,
    startTime: new Date().toISOString().split('T')[0],
    endTime: '2024-12-31'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [promoRes, courseRes] = await Promise.all([
      api.getPromotions(),
      api.getMyCourses()
    ]);
    if (promoRes.success && promoRes.data) setPromotions(promoRes.data);
    if (courseRes.success && courseRes.data) {
      setCourses(courseRes.data);
      if (courseRes.data.length > 0) {
        setFormData(prev => ({ ...prev, courseId: courseRes.data[0].id }));
      }
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: IPromotion) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        courseId: item.courseId,
        type: item.type,
        discountValue: item.discountValue,
        targetQuantity: item.targetQuantity || 50,
        startTime: item.startTime.split('T')[0],
        endTime: item.endTime.split('T')[0]
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: 'Chương trình Ưu Đãi Mùa Hè',
        courseId: courses[0]?.id || '',
        type: 'time_based',
        discountValue: 30,
        targetQuantity: 50,
        startTime: new Date().toISOString().split('T')[0],
        endTime: '2024-12-31'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await api.updatePromotion(editingItem.id, formData);
    } else {
      await api.createPromotion(formData);
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa chương trình ưu đãi này?')) return;
    await api.deletePromotion(id);
    fetchData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Chương Trình Ưu Đãi & Khuyến Mãi (IN-UĐ04 / 05 / 06)</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
          <Plus size={16} /> Tạo Ưu Đãi Mới
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
                  <th>Tên chương trình</th>
                  <th>Loại khuyến mãi</th>
                  <th>Mức giảm</th>
                  <th>Chỉ tiêu / Tiến độ</th>
                  <th>Thời gian áp dụng</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={16} color="#ec4899" />
                        <strong>{item.title}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {item.type === 'time_based' ? 'Theo thời gian' : 'Theo số lượt đăng ký'}
                      </span>
                    </td>
                    <td><strong style={{ color: 'var(--danger)' }}>-{item.discountValue}%</strong></td>
                    <td>
                      {item.type === 'quantity_based' ? (
                        <span>{item.currentRegistrations || 0} / {item.targetQuantity} suất</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Không giới hạn suất</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(item.startTime).toLocaleDateString('vi-VN')} đến {new Date(item.endTime).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleOpenModal(item)} className="btn btn-secondary btn-sm" title="Chỉnh sửa">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Xóa">
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
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editingItem ? 'Chỉnh Sửa Chương Trình Ưu Đãi' : 'Tạo Chương Trình Ưu Đãi Mới'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên chương trình ưu đãi *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Áp dụng cho khóa học *</label>
                <select
                  className="form-select"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Hình thức khuyến mãi</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="time_based">Theo thời gian</option>
                    <option value="quantity_based">Theo số lượng suất</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phần trăm giảm (%) *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className="form-input"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {formData.type === 'quantity_based' && (
                <div className="form-group">
                  <label className="form-label">Số lượng suất đăng ký giới hạn</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input"
                    value={formData.targetQuantity}
                    onChange={(e) => setFormData({ ...formData, targetQuantity: Number(e.target.value) })}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Bắt đầu từ</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kết thúc vào</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Lưu Thay Đổi' : 'Tạo Ưu Đãi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
