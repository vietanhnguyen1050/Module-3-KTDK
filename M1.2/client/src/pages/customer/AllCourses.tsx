import React, { useEffect, useState } from 'react';
import { ICourse } from '../../types';
import { api } from '../../services/api';
import { CourseCard } from '../../components/ui/CourseCard';
import { Search, Filter, BookOpen } from 'lucide-react';

export const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Lập Trình Web', 'Frontend', 'Backend', 'UI/UX Design', 'DevOps'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await api.getCourses({ category, search, status: 'approved' });
    if (res.success && res.data) {
      let list: ICourse[] = res.data;
      if (level !== 'All') {
        list = list.filter(c => c.level === level);
      }
      setCourses(list);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Tất Cả Khóa Học Trực Tuyến</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Khám phá và đăng ký các khóa học lập trình, thiết kế và công nghệ thông tin từ các Nhà Cung Cấp hàng đầu.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: 32, padding: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 40 }}
              placeholder="Tìm theo tên khóa học, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'Tất cả danh mục' : c}</option>
              ))}
            </select>
          </div>

          <div>
            <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
              {levels.map(l => (
                <option key={l} value={l}>{l === 'All' ? 'Tất cả trình độ' : l}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: 42 }}>
            <Filter size={16} /> Lọc
          </button>
        </form>
      </div>

      {/* Course List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Đang tải danh sách khóa học...</div>
      ) : courses.length > 0 ? (
        <div className="course-grid">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <BookOpen size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
          <h3>Không tìm thấy khóa học nào</h3>
          <p style={{ fontSize: 14, marginTop: 8 }}>Vui lòng thay đổi tiêu chí lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      )}
    </div>
  );
};
