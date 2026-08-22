import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IUser } from '../../types';
import { Users, Plus, Edit2, Trash2, Shield, CheckCircle, ShieldBan } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'trader' as any,
    vipLevel: 1,
    status: 'active' as any
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.getAdminUsers();
    if (res.success && res.data) setUsers(res.data);
    setLoading(false);
  };

  const handleOpenModal = (user?: IUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        vipLevel: user.vipLevel || 1,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'trader',
        vipLevel: 1,
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await api.updateAdminUser(editingUser.id, formData);
    } else {
      await api.createAdminUser(formData);
    }
    setShowModal(false);
    fetchUsers();
  };

  const handleToggleStatus = async (user: IUser) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    await api.updateAdminUser(user.id, { status: nextStatus });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa tài khoản này khỏi hệ thống?')) return;
    await api.deleteAdminUser(id);
    fetchUsers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Quản Lý Người Dùng & Cấp Bậc VIP (AD-ADM01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Xem danh sách trader, viewer, quản lý trạng thái tài khoản và phân cấp bậc VIP
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Thêm Tài Khoản Mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách người dùng...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Cấp độ VIP</th>
                  <th>Bảo mật 2FA</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng ký</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td><span className="badge badge-primary">VIP {u.vipLevel || 1}</span></td>
                    <td>
                      {u.twoFactorEnabled ? (
                        <span className="badge badge-buy"><CheckCircle size={11} /> Đã Bật</span>
                      ) : (
                        <span className="badge badge-secondary">Chưa Bật</span>
                      )}
                    </td>
                    <td>
                      {u.status === 'active' ? (
                        <span className="badge badge-buy">Hoạt Động</span>
                      ) : (
                        <span className="badge badge-sell"><ShieldBan size={11} /> Đã Khóa</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-secondary' : 'btn-buy'}`}
                        >
                          {u.status === 'active' ? 'Khóa' : 'Mở Khóa'}
                        </button>
                        <button onClick={() => handleOpenModal(u)} className="btn btn-secondary btn-sm">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="btn btn-danger btn-sm">
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
          <div className="card" style={{ width: '100%', maxWidth: 460, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Vai trò</label>
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="trader">Trader (Giao dịch)</option>
                    <option value="viewer">Viewer (Xem giá)</option>
                    <option value="admin">Admin (Quản trị)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cấp độ VIP</label>
                  <select
                    className="form-select"
                    value={formData.vipLevel}
                    onChange={(e) => setFormData({ ...formData, vipLevel: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lv => (
                      <option key={lv} value={lv}>VIP {lv}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Lưu Thay Đổi' : 'Thêm Người Dùng'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
