import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IGift, ICourse } from '../../types';
import { Plus, Edit2, Trash2, Gift, BookOpen, Code, Headphones } from 'lucide-react';

export const GiftManagement: React.FC = () => {
  const [gifts, setGifts] = useState<IGift[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IGift | null>(null);

  const [formData, setFormData] = useState({
    giftName: '',
    giftDescription: '',
    giftType: 'ebook' as 'ebook' | 'voucher' | 'consultation' | 'source_code',
    courseId: '',
    quantity: 100
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [giftRes, courseRes] = await Promise.all([
      api.getGifts(),
      api.getMyCourses()
    ]);
    if (giftRes.success && giftRes.data) setGifts(giftRes.data);
    if (courseRes.success && courseRes.data) {
      setCourses(courseRes.data);
      if (courseRes.data.length > 0) {
        setFormData(prev => ({ ...prev, courseId: courseRes.data[0].id }));
      }
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: IGift) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        giftName: item.giftName,
        giftDescription: item.giftDescription,
        giftType: item.giftType,
        courseId: item.courseId,
        quantity: item.quantity
      });
    } else {
      setEditingItem(null);
      setFormData({
        giftName: 'Ebook Hướng Dẫn Thực Chiến',
        giftDescription: 'Bộ tài liệu PDF chuyên sâu kèm mã nguồn mẫu.',
        giftType: 'ebook',
        courseId: courses[0]?.id || '',
        quantity: 100
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await api.updateGift(editingItem.id, formData);
    } else {
      await api.createGift(formData);
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa quà tặng này?')) return;
    await api.deleteGift(id);
    fetchData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ebook': return <BookOpen size={16} color="var(--primary)" />;
      case 'source_code': return <Code size={16} color="var(--success)" />;
      case 'consultation': return <Headphones size={16} color="#ec4899" />;
      default: return <Gift size={16} color="var(--warning)" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Quà Tặng Đính Kèm (IN-UĐ07)</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
          <Plus size={16} /> Tạo Quà Tặng Mới
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
                  <th>Tên quà tặng</th>
                  <th>Loại quà tặng</th>
                  <th>Số lượng</th>
                  <th>Còn lại</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ padding: 8, background: '#f1f5f9', borderRadius: 8 }}>
                          {getIcon(item.giftType)}
                        </div>
                        <div>
                          <strong style={{ fontSize: 14 }}>{item.giftName}</strong>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.giftDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{item.giftType}</span></td>
                    <td>{item.quantity}</td>
                    <td><strong style={{ color: 'var(--success)' }}>{item.remainingQuantity}</strong></td>
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
              {editingItem ? 'Chỉnh Sửa Quà Tặng' : 'Tạo Quà Tặng Đính Kèm Mới (IN-UĐ07)'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên quà tặng *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.giftName}
                  onChange={(e) => setFormData({ ...formData, giftName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả quà tặng *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.giftDescription}
                  onChange={(e) => setFormData({ ...formData, giftDescription: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Loại quà tặng</label>
                  <select
                    className="form-select"
                    value={formData.giftType}
                    onChange={(e) => setFormData({ ...formData, giftType: e.target.value as any })}
                  >
                    <option value="ebook">Ebook (Sách điện tử)</option>
                    <option value="source_code">Mã nguồn dự án mẫu</option>
                    <option value="consultation">Phiên tư vấn 1-1</option>
                    <option value="voucher">Voucher khuyến mãi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng suất tặng</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tặng kèm khi học viên đăng ký khóa học:</label>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Lưu Thay Đổi' : 'Tạo Quà Tặng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
