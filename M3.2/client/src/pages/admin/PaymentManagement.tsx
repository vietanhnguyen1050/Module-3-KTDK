import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IPaymentAccount } from '../../types';
import { CreditCard, CheckCircle, XCircle, Edit2 } from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<IPaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const res = await api.getAdminPayments();
    if (res.success && res.data) setAccounts(res.data);
    setLoading(false);
  };

  const handleToggle = async (acc: IPaymentAccount) => {
    const nextStatus = acc.status === 'active' ? 'inactive' : 'active';
    await api.updateAdminPayment(acc.id, { status: nextStatus });
    fetchPayments();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quản Lý Cổng & Tài Khoản Thanh Toán (AD-ADM11)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Cấu hình và kiểm soát các cổng thanh toán quốc tế và nội địa (Stripe, MoMo, VNPay, PayPal)
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải cổng thanh toán...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {accounts.map((acc) => (
            <div key={acc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>{acc.provider}</span>
                  {acc.status === 'active' ? (
                    <span className="badge badge-success"><CheckCircle size={11} /> Đang hoạt động</span>
                  ) : (
                    <span className="badge badge-danger"><XCircle size={11} /> Tạm dừng</span>
                  )}
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{acc.accountName}</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  API Key: <code>{acc.apiKeyMasked}</code>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, background: 'var(--bg-main)', borderRadius: 8, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Giao dịch</span>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{acc.transactionCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Đã xử lý</span>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--success)' }}>
                      {acc.totalProcessed.toLocaleString()} {acc.provider === 'momo' || acc.provider === 'vnpay' ? 'VND' : 'USD'}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggle(acc)}
                className={`btn btn-sm ${acc.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
              >
                {acc.status === 'active' ? 'Tạm Ngưng Cổng Này' : 'Kích Hoạt Cổng Thanh Toán'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
