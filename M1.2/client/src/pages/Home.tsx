import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ICourse } from '../types';
import { api } from '../services/api';
import { CourseCard } from '../components/ui/CourseCard';
import { Search, Sparkles, BookOpen, ShieldCheck, Award, Zap, Gift } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Lập Trình Web', 'Frontend', 'Backend', 'UI/UX Design', 'DevOps'];

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await api.getCourses({ category, search, status: 'approved' });
    if (res.success && res.data) {
      setFeaturedCourses(res.data);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        color: 'white',
        padding: '70px 0',
        marginBottom: 48
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20
            }}>
              <Sparkles size={16} color="#38bdf8" />
              <span>Nền Tảng Giáo Dục Trực Tuyến Đột Phá</span>
            </div>

            <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Khám Phá Tri Thức Mới Cùng Hàng Trăm Khóa Học Chất Lượng
            </h1>

            <p style={{ fontSize: 16, color: '#c7d2fe', lineHeight: 1.6, marginBottom: 32 }}>
              Học tập linh hoạt cùng các giảng viên và nhà cung cấp khóa học uy tín. Nhận ưu đãi giảm giá đến 50% cùng chương trình quà tặng đặc biệt!
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              background: 'white',
              borderRadius: 12,
              padding: 6,
              maxWidth: 540,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 12, color: '#64748b' }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học (VD: React, TypeScript, HTML...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '12px 14px',
                  fontSize: 15,
                  color: '#0f172a'
                }}
              />
              <button type="submit" className="btn btn-primary">
                Tìm Kiếm
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <Zap size={28} color="#38bdf8" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800 }}>100+</h3>
              <p style={{ fontSize: 13, color: '#c7d2fe' }}>Khóa học chất lượng cao</p>
            </div>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <ShieldCheck size={28} color="#4ade80" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800 }}>100%</h3>
              <p style={{ fontSize: 13, color: '#c7d2fe' }}>Kiểm duyệt bởi Admin</p>
            </div>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <Gift size={28} color="#f472b6" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800 }}>50+</h3>
              <p style={{ fontSize: 13, color: '#c7d2fe' }}>Ưu đãi & Quà tặng kèm</p>
            </div>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <Award size={28} color="#fbbf24" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800 }}>4.9/5</h3>
              <p style={{ fontSize: 13, color: '#c7d2fe' }}>Đánh giá từ học viên</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter & Featured Courses */}
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Danh Mục Nổi Bật</span>
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>Các Khóa Học Được Đăng Tải</h2>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat === 'All' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách khóa học...</div>
        ) : featuredCourses.length > 0 ? (
          <div className="course-grid">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
            <h3>Không tìm thấy khóa học nào phù hợp</h3>
            <p style={{ fontSize: 14, marginTop: 8 }}>Vui lòng chọn danh mục khác hoặc thử từ khóa tìm kiếm mới.</p>
          </div>
        )}
      </div>
    </div>
  );
};
