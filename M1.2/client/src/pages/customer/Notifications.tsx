import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { INotification } from '../../types';
import { Bell, Info, Award, Tag, CreditCard } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    setLoading(true);
    const res = await api.getNotifications();
    if (res.success && res.data) {
      setNotifications(res.data);
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard size={18} color="var(--success)" />;
      case 'promotion': return <Tag size={18} color="var(--warning)" />;
      case 'course': return <Award size={18} color="var(--primary)" />;
      default: return <Info size={18} color="var(--secondary)" />;
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Thông Báo Hệ Thống (CT-QLTT07)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cập nhật các sự kiện, tiến độ khóa học và ưu đãi mới nhất</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải thông báo...</div>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((notif) => (
            <div key={notif.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20 }}>
              <div style={{ padding: 10, background: '#f1f5f9', borderRadius: '50%', flexShrink: 0 }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{notif.title}</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <Bell size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
          <h3>Không có thông báo mới nào</h3>
        </div>
      )}
    </div>
  );
};
