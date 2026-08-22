import { IPriceAlert, IPromotion, ISupportTicket } from '../types';
import { MarketModel } from './market.model';

// Price Alerts (TRD-ALRT01, VWR-ALRT01)
export const mockAlerts: IPriceAlert[] = [
  { id: 'alt_1', userId: 'user_trader', symbol: 'BTC/USDT', targetPrice: 70000.0, condition: '>=', currentPrice: 67450.0, status: 'active', createdAt: '2024-02-22T09:00:00Z' },
  { id: 'alt_2', userId: 'user_trader', symbol: 'SOL/USDT', targetPrice: 200.0, condition: '>=', currentPrice: 184.2, status: 'active', createdAt: '2024-02-22T10:00:00Z' },
  { id: 'alt_3', userId: 'user_viewer', symbol: 'ETH/USDT', targetPrice: 3400.0, condition: '<=', currentPrice: 3520.5, status: 'active', createdAt: '2024-02-21T12:00:00Z' }
];

export class AlertModel {
  static getAlerts(userId?: string): IPriceAlert[] {
    if (!userId) return mockAlerts;
    return mockAlerts.filter(a => a.userId === userId);
  }

  static createAlert(data: Partial<IPriceAlert>): IPriceAlert {
    const pair = MarketModel.getPairBySymbol(data.symbol || 'BTC/USDT');
    const newAlert: IPriceAlert = {
      id: `alt_${Date.now()}`,
      userId: data.userId || 'user_trader',
      symbol: data.symbol || 'BTC/USDT',
      targetPrice: data.targetPrice || 70000,
      condition: data.condition || '>=',
      currentPrice: pair?.lastPrice || 67450.0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockAlerts.unshift(newAlert);
    return newAlert;
  }

  static deleteAlert(id: string): boolean {
    const idx = mockAlerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    mockAlerts.splice(idx, 1);
    return true;
  }
}

// Promotions (TRD-PRM01, AD-ADM12)
export const mockPromotions: IPromotion[] = [
  {
    id: 'prm_1',
    title: 'Sự Kiện Airdrop Planet Token 2024',
    description: 'Đăng ký và hoàn thành giao dịch đầu tiên để nhận ngay 100 USDT & 500 PLANET.',
    rewardText: '100 USDT Airdrop',
    code: 'PLANET2024',
    type: 'airdrop',
    bannerUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    status: 'active'
  },
  {
    id: 'prm_2',
    title: 'Zero-Fee Spot Trading Maker & Taker',
    description: 'Miễn 100% phí giao dịch cho tất cả các cặp giao dịch SOL & BTC trong khung giờ vàng.',
    rewardText: '0% Phí Giao Dịch',
    code: 'ZEROFEE',
    type: 'fee_discount',
    bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    status: 'active'
  }
];

export class PromotionModel {
  static getPromotions(): IPromotion[] {
    return mockPromotions;
  }

  static create(data: Partial<IPromotion>): IPromotion {
    const item: IPromotion = {
      id: `prm_${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      rewardText: data.rewardText || '',
      code: data.code || 'PROMO',
      type: data.type || 'fee_discount',
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      startDate: data.startDate || new Date().toISOString().slice(0, 10),
      endDate: data.endDate || '2024-12-31',
      status: 'active'
    };
    mockPromotions.unshift(item);
    return item;
  }

  static update(id: string, data: Partial<IPromotion>): IPromotion | null {
    const idx = mockPromotions.findIndex(p => p.id === id);
    if (idx === -1) return null;
    mockPromotions[idx] = { ...mockPromotions[idx], ...data };
    return mockPromotions[idx];
  }

  static delete(id: string): boolean {
    const idx = mockPromotions.findIndex(p => p.id === id);
    if (idx === -1) return false;
    mockPromotions.splice(idx, 1);
    return true;
  }
}

// Support Tickets (TRD-SPT01, VWR-SPT01, AD-ADM07)
export const mockTickets: ISupportTicket[] = [
  {
    id: 'tkt_1',
    userId: 'user_trader',
    userName: 'Nguyễn Văn Anh',
    userEmail: 'trader@cryptoplanet.io',
    category: 'deposit_withdraw',
    subject: 'Nạp USDT mạng TRC20 chưa cộng số dư sau 15 block',
    description: 'TxHash 0x8f7a9b...1c2d3e đã có 20 xác nhận trên Tronscan nhưng ví chưa nhảy số dư.',
    priority: 'high',
    status: 'in_progress',
    response: 'Đội ngũ kỹ thuật sàn đã kiểm tra và đang đồng bộ lại node TRON.',
    createdAt: '2024-02-22T08:15:00Z'
  },
  {
    id: 'tkt_2',
    userId: 'user_viewer',
    userName: 'Trần Thị Mai',
    userEmail: 'viewer@cryptoplanet.io',
    category: 'account_security',
    subject: 'Hướng dẫn cài đặt Google Authenticator 2FA',
    description: 'Tôi muốn nâng cấp tài khoản lên Trader và bật 2FA.',
    priority: 'medium',
    status: 'resolved',
    response: 'Bạn hãy vào mục Hồ Sơ & Bảo Mật -> Quét mã QR 2FA trong ứng dụng Google Authenticator.',
    createdAt: '2024-02-20T11:00:00Z'
  }
];

export class SupportModel {
  static getTickets(userId?: string): ISupportTicket[] {
    if (!userId) return mockTickets;
    return mockTickets.filter(t => t.userId === userId);
  }

  static create(data: Partial<ISupportTicket>): ISupportTicket {
    const item: ISupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: data.userId || 'user_trader',
      userName: data.userName || 'Trader',
      userEmail: data.userEmail || '',
      category: data.category || 'other',
      subject: data.subject || '',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString()
    };
    mockTickets.unshift(item);
    return item;
  }

  static update(id: string, data: Partial<ISupportTicket>): ISupportTicket | null {
    const idx = mockTickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    mockTickets[idx] = { ...mockTickets[idx], ...data };
    return mockTickets[idx];
  }
}
