import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>
              <GraduationCap size={24} color="#818cf8" />
              <span>Edupress Platform</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
              Hệ thống học trực tuyến hàng đầu kết nối Nhà cung cấp khóa học uy tín và học viên, mang đến trải nghiệm học tập chuẩn thực chiến.
            </p>
          </div>

          <div className="footer-col">
            <h4>Khách Hàng</h4>
            <ul>
              <li><Link to="/courses">Khám phá khóa học</Link></li>
              <li><Link to="/my-courses">Khóa học của tôi</Link></li>
              <li><Link to="/register-provider">Đăng ký làm NCC</Link></li>
              <li><Link to="/profile">Hồ sơ cá nhân</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Nhà Cung Cấp</h4>
            <ul>
              <li><Link to="/provider/courses">Quản lý khóa học</Link></li>
              <li><Link to="/provider/discounts">Mã giảm giá</Link></li>
              <li><Link to="/provider/promotions">Chương trình ưu đãi</Link></li>
              <li><Link to="/provider/revenue">Báo cáo doanh thu</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quản Trị Viên</h4>
            <ul>
              <li><Link to="/admin/overview">Tổng quan hệ thống</Link></li>
              <li><Link to="/admin/courses">Kiểm duyệt khóa học</Link></li>
              <li><Link to="/admin/providers">Phê duyệt NCC</Link></li>
              <li><Link to="/admin/financials">Báo cáo tài chính</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Edupress E-Learning Platform. Xây dựng theo tiêu chuẩn kiểm tra Module 1 (MindX Technology School).</p>
        </div>
      </div>
    </footer>
  );
};
