import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IUser } from '../../types';
import { ShieldBan, ShieldCheck } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await api.getAdminCustomers();
    if (res.success && res.data) setCustomers(res.data);
    setLoading(false);
  };

  const handleToggle = async (id: string) => {
    await api.toggleCustomerStatus(id);
    fetchCustomers();
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Khách Hàng / Học Viên (AD-CT01)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Xem thông tin và quản lý trạng thái tài khoản học viên trên nền tảng
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt=""
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{c.name}</strong>
                          {c.deleteRequested && (
                            <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>
                              ⚠ Yêu cầu xóa tài khoản
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone || 'Chưa cập nhật'}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      {c.status === 'active' ? (
                        <span className="badge badge-success">Hoạt động</span>
                      ) : (
                        <span className="badge badge-danger">Đã khóa</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggle(c.id)}
                        className={`btn btn-sm ${c.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                      >
                        {c.status === 'active' ? (
                          <><ShieldBan size={14} /> Khóa tài khoản</>
                        ) : (
                          <><ShieldCheck size={14} /> Mở lại</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
