import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react';

export const DashboardCreate: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sales & Revenue',
    layout: 'grid' as 'grid' | 'flex' | 'compact',
    theme: 'indigo' as 'indigo' | 'dark' | 'light',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await api.createDashboard(formData);
    setLoading(false);

    if (res.success && res.data) {
      navigate(`/dashboards/${res.data.id}`);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/dashboards" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
          <ArrowLeft size={14} /> Quay lại danh sách
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Tạo Bảng Điều Khiển Mới (USR-DBD01)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Thiết lập bảng điều khiển và bắt đầu thêm các widget theo dõi chỉ số
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên bảng điều khiển *</label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Q1 Marketing & Revenue Dashboard"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả mục đích theo dõi</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Mô tả ngắn gọn về các chỉ số và mục tiêu của bảng điều khiển này..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Sales & Revenue">Sales & Revenue</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Marketing">Marketing & Ads</option>
                <option value="Product Analytics">Product Analytics</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bố cục mặc định</label>
              <select
                className="form-select"
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })}
              >
                <option value="grid">Grid 12-Columns Responsive</option>
                <option value="flex">Flex Flow Auto</option>
                <option value="compact">Compact Dense View</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              <span>Cho phép chia sẻ công khai qua đường link (Public Dashboard)</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
            <Sparkles size={18} />
            <span>{loading ? 'Đang khởi tạo...' : 'Tạo Bảng Điều Khiển Ngay'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
