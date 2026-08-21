import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { IDashboard, IWidget } from '../../types';
import { ChartWidget } from '../../components/ui/ChartWidget';
import {
  Plus, Download, Share2, Settings, ArrowLeft,
  Sparkles, Layers, Palette, CheckCircle, Trash2, Globe, Lock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dashboard, setDashboard] = useState<IDashboard | null>(null);
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Add Widget Form state
  const [widgetForm, setWidgetForm] = useState({
    title: 'New Metric Card',
    type: 'metric' as any,
    size: 'small' as any,
    metricLabel: 'Tỷ lệ tăng trưởng',
    metricValue: '94.2%',
    metricChange: '+5.4% tuần này',
    isPositive: true,
    color: '#4f46e5'
  });

  // Share Form state
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'viewer' | 'editor'>('viewer');
  const [isPublicState, setIsPublicState] = useState(false);

  // Theme & Layout state
  const [theme, setTheme] = useState<'indigo' | 'dark' | 'light'>('indigo');
  const [layout, setLayout] = useState<'grid' | 'flex' | 'compact'>('grid');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    const res = await api.getDashboardById(id);
    if (res.success && res.data) {
      setDashboard(res.data);
      setWidgets(res.data.widgets || []);
      setIsPublicState(res.data.isPublic);
      setTheme(res.data.theme || 'indigo');
      setLayout(res.data.layout || 'grid');
    }
    setLoading(false);
  };

  const handleAddWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    let config: any = {};
    if (widgetForm.type === 'metric') {
      config = {
        metricLabel: widgetForm.metricLabel,
        metricValue: widgetForm.metricValue,
        metricChange: widgetForm.metricChange,
        isPositive: widgetForm.isPositive,
        color: widgetForm.color
      };
    } else if (widgetForm.type === 'line' || widgetForm.type === 'area') {
      config = {
        chartLabels: ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'],
        chartData: [20, 35, 60, 45, 80, 95, 110],
        color: widgetForm.color
      };
    } else if (widgetForm.type === 'bar') {
      config = {
        chartLabels: ['Nhóm 1', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4', 'Nhóm 5'],
        chartData: [45, 80, 120, 65, 90],
        color: widgetForm.color
      };
    } else if (widgetForm.type === 'donut') {
      config = {
        chartLabels: ['Loại A', 'Loại B', 'Loại C', 'Loại D'],
        chartData: [40, 30, 20, 10],
        color: widgetForm.color
      };
    }

    const res = await api.createWidget(id, {
      title: widgetForm.title,
      type: widgetForm.type,
      size: widgetForm.size,
      config
    });

    if (res.success) {
      setShowAddWidget(false);
      fetchDetail();
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!window.confirm('Xóa widget này khỏi bảng điều khiển?')) return;
    await api.deleteWidget(widgetId);
    fetchDetail();
  };

  const handleSaveThemeLayout = async () => {
    if (!id) return;
    await api.updateDashboard(id, { theme, layout });
    setShowCustomModal(false);
    fetchDetail();
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await api.shareDashboard(id, {
      email: shareEmail,
      role: shareRole,
      isPublic: isPublicState
    });
    setShareEmail('');
    fetchDetail();
  };

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    if (!id) return;
    const res = await api.exportDashboardData(id, format);
    if (res.success) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${dashboard?.title || 'dashboard'}_export.${format === 'pdf' ? 'json' : format}`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert(`Đã xuất file dữ liệu (${format.toUpperCase()}) thành công!`);
    }
  };

  if (loading || !dashboard) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>Đang tải bảng điều khiển...</div>;
  }

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Link to="/dashboards" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            <ArrowLeft size={14} /> Danh sách Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>{dashboard.title}</h1>
            <span className="badge badge-primary">{dashboard.category}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{dashboard.description}</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setShowAddWidget(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Thêm Widget (USR-DBD06)
          </button>

          <button onClick={() => setShowCustomModal(true)} className="btn btn-secondary btn-sm" title="Tùy chỉnh giao diện">
            <Palette size={15} /> Giao Diện (USR-DBD07)
          </button>

          <button onClick={() => setShowShareModal(true)} className="btn btn-secondary btn-sm" title="Chia sẻ">
            <Share2 size={15} /> Chia Sẻ (USR-DBD05)
          </button>

          <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => handleExport('csv')} className="btn btn-secondary btn-sm" style={{ border: 'none', borderRadius: 0 }}>
              <Download size={14} /> CSV
            </button>
            <button onClick={() => handleExport('json')} className="btn btn-secondary btn-sm" style={{ border: 'none', borderLeft: '1px solid var(--border)', borderRadius: 0 }}>
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Widgets Grid (USR-DBD12: Biểu đồ nâng cao) */}
      {widgets.length > 0 ? (
        <div className="widget-grid">
          {widgets.map((widget) => (
            <ChartWidget key={widget.id} widget={widget} onDelete={handleDeleteWidget} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>Bảng điều khiển này chưa có widget nào</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 20 }}>
            Nhấn vào nút "Thêm Widget" ở trên để bổ sung biểu đồ, số liệu hoặc bảng dữ liệu.
          </p>
          <button onClick={() => setShowAddWidget(true)} className="btn btn-primary">
            <Plus size={16} /> Thêm Widget Ngay
          </button>
        </div>
      )}

      {/* Modal 1: Thêm Widget (USR-DBD06) */}
      {showAddWidget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Thêm Widget Trực Quan Hóa (USR-DBD06)</h3>
            <form onSubmit={handleAddWidget}>
              <div className="form-group">
                <label className="form-label">Tiêu đề Widget *</label>
                <input
                  type="text"
                  className="form-input"
                  value={widgetForm.title}
                  onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Loại Widget</label>
                  <select
                    className="form-select"
                    value={widgetForm.type}
                    onChange={(e) => setWidgetForm({ ...widgetForm, type: e.target.value })}
                  >
                    <option value="metric">Thẻ Số Liệu (Metric Card)</option>
                    <option value="line">Biểu Đồ Đường (Line Chart)</option>
                    <option value="bar">Biểu Đồ Cột (Bar Chart)</option>
                    <option value="area">Biểu Đồ Miền (Area Chart)</option>
                    <option value="donut">Biểu Đồ Tròn (Donut Chart)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Kích thước hiển thị</label>
                  <select
                    className="form-select"
                    value={widgetForm.size}
                    onChange={(e) => setWidgetForm({ ...widgetForm, size: e.target.value })}
                  >
                    <option value="small">Nhỏ (1/4 hàng - Small)</option>
                    <option value="medium">Vừa (1/2 hàng - Medium)</option>
                    <option value="large">Lớn (2/3 hàng - Large)</option>
                    <option value="full">Toàn hàng (Full Width)</option>
                  </select>
                </div>
              </div>

              {widgetForm.type === 'metric' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Giá trị số liệu</label>
                    <input
                      type="text"
                      className="form-input"
                      value={widgetForm.metricValue}
                      onChange={(e) => setWidgetForm({ ...widgetForm, metricValue: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả tăng trưởng</label>
                    <input
                      type="text"
                      className="form-input"
                      value={widgetForm.metricChange}
                      onChange={(e) => setWidgetForm({ ...widgetForm, metricChange: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Màu sắc biểu đồ chủ đạo</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setWidgetForm({ ...widgetForm, color: col })}
                      style={{
                        width: 32, height: 32, borderRadius: 6, background: col,
                        border: widgetForm.color === col ? '3px solid #0f172a' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowAddWidget(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">Thêm Vào Dashboard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Tùy chỉnh Giao diện (USR-DBD07) */}
      {showCustomModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Tùy Chỉnh Giao Diện & Bố Cục (USR-DBD07)</h3>

            <div className="form-group">
              <label className="form-label">Theme Màu Sắc</label>
              <select className="form-select" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                <option value="indigo">Indigo Tech (Mặc định)</option>
                <option value="dark">Dark Slate Cyber</option>
                <option value="light">Clean Light Studio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bố cục dàn trang (Layout Grid)</label>
              <select className="form-select" value={layout} onChange={(e) => setLayout(e.target.value as any)}>
                <option value="grid">Grid Layout 12-Columns Responsive</option>
                <option value="flex">Flex Flow Dynamic</option>
                <option value="compact">Compact Dense View</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowCustomModal(false)} className="btn btn-secondary">Hủy</button>
              <button onClick={handleSaveThemeLayout} className="btn btn-primary">Lưu Thay Đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Chia sẻ Dashboard (USR-DBD05, USR-DBD13) */}
      {showShareModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 540, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Chia Sẻ & Phân Quyền Truy Cập (USR-DBD05 / USR-DBD13)</h3>

            <form onSubmit={handleShare} style={{ marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'center' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Nhập email đồng nghiệp..."
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  value={shareRole}
                  onChange={(e) => setShareRole(e.target.value as any)}
                >
                  <option value="viewer">Chỉ Xem (Viewer)</option>
                  <option value="editor">Chỉnh Sửa (Editor)</option>
                </select>
                <button type="submit" className="btn btn-primary btn-sm" style={{ height: 42 }}>
                  Mời
                </button>
              </div>
            </form>

            <div className="form-group" style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={isPublicState}
                  onChange={(e) => setIsPublicState(e.target.checked)}
                />
                <span>Cho phép bất kỳ ai có đường link xem bảng điều khiển này (Public Web Link)</span>
              </label>
            </div>

            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Danh sách người có quyền truy cập:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 6, fontSize: 13 }}>
                  <span>{dashboard.userName} (Bạn)</span>
                  <span className="badge badge-primary">Chủ sở hữu (Owner)</span>
                </div>
                {dashboard.sharedWith?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 6, fontSize: 13 }}>
                    <span>{s.email}</span>
                    <span className="badge badge-warning">{s.role.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowShareModal(false)} className="btn btn-secondary">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
