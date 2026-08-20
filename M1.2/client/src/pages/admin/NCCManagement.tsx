import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IUser } from '../../types';
import { Check, X, ShieldAlert, Star, CheckCircle, Clock } from 'lucide-react';

export const NCCManagement: React.FC = () => {
  const [providers, setProviders] = useState<IUser[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [pRes, rRes] = await Promise.all([
      api.getAdminProviders(),
      api.getAdminNCCReviews()
    ]);
    if (pRes.success && pRes.data) setProviders(pRes.data);
    if (rRes.success && rRes.data) setReviews(rRes.data);
    setLoading(false);
  };

  const handleApprove = async (id: string, action: 'approve' | 'reject' | 'toggle_status') => {
    await api.approveProvider(id, action);
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý & Duyệt Nhà Cung Cấp (AD-NCC01 / 02)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Xét duyệt hồ sơ đăng ký làm đối tác và quản lý trạng thái tài khoản NCC
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải danh sách NCC...</div>
      ) : (
        <>
          {/* Table NCC */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 36 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên NCC / Đại diện</th>
                    <th>Email & SĐT</th>
                    <th>Tổ chức / Mô tả</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Thao tác xét duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.providerInfo?.organizationName || 'Cá nhân'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{p.email}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.phone || 'Chưa cập nhật'}</div>
                      </td>
                      <td style={{ maxWidth: 260 }}>
                        <div style={{ fontSize: 13, color: '#475569' }}>{p.providerInfo?.description || 'N/A'}</div>
                        {p.providerInfo?.website && (
                          <a href={p.providerInfo.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#3b82f6' }}>
                            {p.providerInfo.website}
                          </a>
                        )}
                      </td>
                      <td>
                        {p.role === 'provider' && p.status === 'active' && (
                          <span className="badge badge-success"><CheckCircle size={12} /> Đã Phê Duyệt</span>
                        )}
                        {p.status === 'pending_approval' && (
                          <span className="badge badge-warning"><Clock size={12} /> Chờ Duyệt (AD-NCC01)</span>
                        )}
                        {p.status === 'blocked' && (
                          <span className="badge badge-danger">Đã Khóa</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          {p.status === 'pending_approval' && (
                            <>
                              <button onClick={() => handleApprove(p.id, 'approve')} className="btn btn-success btn-sm" title="Duyệt làm NCC">
                                <Check size={14} /> Duyệt NCC
                              </button>
                              <button onClick={() => handleApprove(p.id, 'reject')} className="btn btn-danger btn-sm" title="Từ chối">
                                <X size={14} /> Từ chối
                              </button>
                            </>
                          )}

                          {p.role === 'provider' && (
                            <button
                              onClick={() => handleApprove(p.id, 'toggle_status')}
                              className={`btn btn-sm ${p.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                              title="Khóa/Mở tài khoản"
                            >
                              {p.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Thống kê đánh giá NCC (AD-NCC03) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Thống Kê Đánh Giá Về Các NCC (AD-NCC03)</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khóa học</th>
                    <th>Nhà Cung Cấp</th>
                    <th>Người đánh giá</th>
                    <th>Số sao</th>
                    <th>Nội dung nhận xét</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.courseTitle}</strong></td>
                      <td>{r.providerName}</td>
                      <td>{r.userName}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
                          <Star size={14} fill="#f59e0b" />
                          <span>{r.rating}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: '#475569' }}>{r.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
