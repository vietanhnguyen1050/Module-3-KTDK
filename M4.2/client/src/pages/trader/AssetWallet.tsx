import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IWalletBalance, ITransaction } from '../../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const AssetWallet: React.FC = () => {
  const [balances, setBalances] = useState<IWalletBalance[]>([]);
  const [totalPortfolio, setTotalPortfolio] = useState<number>(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Forms
  const [depositForm, setDepositForm] = useState({ coinSymbol: 'USDT', amount: 1000, network: 'TRC-20' });
  const [withdrawForm, setWithdrawForm] = useState({ coinSymbol: 'USDT', amount: 100, network: 'TRC-20', address: '' });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    const [balRes, txRes] = await Promise.all([
      api.getBalances(),
      api.getTransactions()
    ]);

    if (balRes.success && balRes.data) {
      setBalances(balRes.data.balances || []);
      setTotalPortfolio(balRes.data.totalPortfolioUSDT || 0);
    }
    if (txRes.success && txRes.data) {
      setTransactions(txRes.data);
    }
    setLoading(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await api.deposit(depositForm);
    if (res.success) {
      setMsg({ type: 'success', text: res.message || 'Nạp tiền thành công!' });
      setShowDeposit(false);
      fetchWalletData();
    } else {
      setMsg({ type: 'error', text: res.message || 'Nạp tiền thất bại.' });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await api.withdraw(withdrawForm);
    if (res.success) {
      setMsg({ type: 'success', text: res.message || 'Rút tiền thành công!' });
      setShowWithdraw(false);
      fetchWalletData();
    } else {
      setMsg({ type: 'error', text: res.message || 'Rút tiền thất bại.' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Ví Tài Sản & Nạp Rút (TRD-ASST01 / TRD-FIN01)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Quản lý số dư tiền mã hóa khả dụng, đóng băng và lịch sử nạp rút tiền an toàn
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowDeposit(true)} className="btn btn-primary">
            <ArrowDownLeft size={16} /> Nạp Tiền (Deposit)
          </button>
          <button onClick={() => setShowWithdraw(true)} className="btn btn-secondary">
            <ArrowUpRight size={16} /> Rút Tiền (Withdraw)
          </button>
        </div>
      </div>

      {msg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
          borderRadius: 6, fontSize: 13, marginBottom: 20,
          background: msg.type === 'success' ? 'var(--buy-light)' : 'var(--sell-light)',
          color: msg.type === 'success' ? 'var(--buy)' : 'var(--sell)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Portfolio Card */}
      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, #151a23 0%, #1e2430 100%)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>TỔNG ƯỚC TÍNH TÀI SẢN (ESTIMATED PORTFOLIO)</span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
          ${totalPortfolio.toLocaleString()} <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400 }}>USDT</span>
        </h2>
        <span style={{ fontSize: 12, color: 'var(--buy)', fontWeight: 600 }}>≈ {(totalPortfolio / 67450).toFixed(4)} BTC</span>
      </div>

      {/* Balances Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Số Dư Khả Dụng Trong Ví</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tài sản</th>
                <th>Số dư khả dụng</th>
                <th>Đang khóa (Lệnh mở)</th>
                <th>Giá thị trường</th>
                <th>Tổng quy đổi (USDT)</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((b) => (
                <tr key={b.coinSymbol}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={b.icon || 'https://assets.coingecko.com/coins/images/325/small/Tether.png'} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                      <strong>{b.coinSymbol}</strong>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.name}</span>
                    </div>
                  </td>
                  <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{b.available.toLocaleString()}</strong></td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{b.locked.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${b.priceInUSDT.toLocaleString()}</td>
                  <td><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>${b.valueInUSDT.toLocaleString()}</strong></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => { setDepositForm({ ...depositForm, coinSymbol: b.coinSymbol }); setShowDeposit(true); }}
                        className="btn btn-secondary btn-sm"
                      >
                        Nạp
                      </button>
                      <button
                        onClick={() => { setWithdrawForm({ ...withdrawForm, coinSymbol: b.coinSymbol }); setShowWithdraw(true); }}
                        className="btn btn-secondary btn-sm"
                      >
                        Rút
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Nạp Tiền Điện Tử Vào Ví</h3>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Chọn đồng Coin</label>
                <select
                  className="form-select"
                  value={depositForm.coinSymbol}
                  onChange={(e) => setDepositForm({ ...depositForm, coinSymbol: e.target.value })}
                >
                  <option value="USDT">USDT (Tether USD)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="SOL">SOL (Solana)</option>
                  <option value="BNB">BNB (BNB Chain)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mạng lưới nạp (Network)</label>
                <select
                  className="form-select"
                  value={depositForm.network}
                  onChange={(e) => setDepositForm({ ...depositForm, network: e.target.value })}
                >
                  <option value="TRC-20">TRON (TRC-20) - Phí thấp nhất</option>
                  <option value="ERC-20">Ethereum (ERC-20)</option>
                  <option value="BEP-20">BNB Smart Chain (BEP-20)</option>
                  <option value="SOL">Solana Native</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng nạp thử nghiệm</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ padding: 12, background: 'var(--bg-dark)', borderRadius: 6, marginBottom: 18, fontSize: 11, color: 'var(--text-muted)' }}>
                Địa chỉ ví nhận tiền sàn: <code>0x71C...8e9F4aB2</code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowDeposit(false)} className="btn btn-secondary">Đóng</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Nạp Tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 460, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Rút Tiền Khỏi Ví Sàn</h3>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label className="form-label">Chọn đồng Coin rút</label>
                <select
                  className="form-select"
                  value={withdrawForm.coinSymbol}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, coinSymbol: e.target.value })}
                >
                  <option value="USDT">USDT (Tether USD)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="SOL">SOL (Solana)</option>
                  <option value="BNB">BNB (BNB Chain)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ ví người nhận *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập địa chỉ ví đích..."
                  value={withdrawForm.address}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng rút</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowWithdraw(false)} className="btn btn-secondary">Đóng</button>
                <button type="submit" className="btn btn-danger">Xác Nhận Rút Tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
