import { IWidget } from '../types';

export const mockWidgets: IWidget[] = [
  // E-Commerce Dashboard widgets
  {
    id: 'w_total_revenue',
    dashboardId: 'db_ecommerce',
    title: 'Tổng Doanh Thu Tháng Này',
    type: 'metric',
    config: {
      metricLabel: 'Doanh thu gộp (Gross Revenue)',
      metricValue: '$124,592.00',
      metricChange: '+18.4% so với tháng trước',
      isPositive: true,
      color: '#10b981'
    },
    size: 'small',
    order: 1
  },
  {
    id: 'w_total_orders',
    dashboardId: 'db_ecommerce',
    title: 'Số Lượng Đơn Hàng',
    type: 'metric',
    config: {
      metricLabel: 'Đơn hàng hoàn tất',
      metricValue: '3,842',
      metricChange: '+12.1% tăng trưởng',
      isPositive: true,
      color: '#3b82f6'
    },
    size: 'small',
    order: 2
  },
  {
    id: 'w_conversion_rate',
    dashboardId: 'db_ecommerce',
    title: 'Tỷ Lệ Chuyển Đổi',
    type: 'metric',
    config: {
      metricLabel: 'Conversion Rate',
      metricValue: '4.85%',
      metricChange: '-0.3% so với tuần trước',
      isPositive: false,
      color: '#f59e0b'
    },
    size: 'small',
    order: 3
  },
  {
    id: 'w_active_customers',
    dashboardId: 'db_ecommerce',
    title: 'Khách Hàng Hoạt Động',
    type: 'metric',
    config: {
      metricLabel: 'Active Buyers 30D',
      metricValue: '28,409',
      metricChange: '+24.5% bùng nổ',
      isPositive: true,
      color: '#8b5cf6'
    },
    size: 'small',
    order: 4
  },
  {
    id: 'w_revenue_line',
    dashboardId: 'db_ecommerce',
    title: 'Biểu Đồ Xu Hướng Doanh Thu Theo Tuần (Line Chart)',
    type: 'line',
    config: {
      chartLabels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7'],
      chartData: [45000, 52000, 49000, 68000, 75000, 89000, 124592],
      color: '#4f46e5'
    },
    size: 'large',
    order: 5
  },
  {
    id: 'w_category_donut',
    dashboardId: 'db_ecommerce',
    title: 'Phân Bổ Doanh Thu Theo Danh Mục (Donut Chart)',
    type: 'donut',
    config: {
      chartLabels: ['Điện tử & Công nghệ', 'Thời trang', 'Gia dụng', 'Sách & Khóa học', 'Khác'],
      chartData: [42, 28, 15, 10, 5],
      color: '#0ea5e9'
    },
    size: 'medium',
    order: 6
  },
  // Infrastructure Dashboard widgets
  {
    id: 'w_cpu_usage',
    dashboardId: 'db_infrastructure',
    title: 'CPU Usage Utilization (%)',
    type: 'area',
    config: {
      chartLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      chartData: [28, 32, 45, 78, 85, 62, 40],
      color: '#ef4444'
    },
    size: 'large',
    order: 1
  },
  {
    id: 'w_api_latency',
    dashboardId: 'db_infrastructure',
    title: 'API P95 Response Latency (ms)',
    type: 'bar',
    config: {
      chartLabels: ['Auth API', 'Orders API', 'Search API', 'Payment Gateway', 'Webhook Sync'],
      chartData: [45, 120, 85, 230, 95],
      color: '#f97316'
    },
    size: 'medium',
    order: 2
  }
];

export class WidgetModel {
  static async findByDashboardId(dashboardId: string): Promise<IWidget[]> {
    return mockWidgets.filter(w => w.dashboardId === dashboardId).sort((a, b) => a.order - b.order);
  }

  static async findById(id: string): Promise<IWidget | undefined> {
    return mockWidgets.find(w => w.id === id);
  }

  static async create(data: Partial<IWidget>): Promise<IWidget> {
    const newWidget: IWidget = {
      id: `w_${Date.now()}`,
      dashboardId: data.dashboardId || '',
      title: data.title || 'Widget',
      type: data.type || 'metric',
      dataSourceId: data.dataSourceId,
      config: data.config || {},
      size: data.size || 'medium',
      order: data.order || (mockWidgets.filter(w => w.dashboardId === data.dashboardId).length + 1)
    };
    mockWidgets.push(newWidget);
    return newWidget;
  }

  static async update(id: string, updateData: Partial<IWidget>): Promise<IWidget | null> {
    const idx = mockWidgets.findIndex(w => w.id === id);
    if (idx === -1) return null;
    mockWidgets[idx] = { ...mockWidgets[idx], ...updateData };
    return mockWidgets[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const idx = mockWidgets.findIndex(w => w.id === id);
    if (idx === -1) return false;
    mockWidgets.splice(idx, 1);
    return true;
  }
}
