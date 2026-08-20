import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ICourse } from '../../types';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Video, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objective: '',
    price: 990000,
    originalPrice: 1500000,
    category: 'Lập Trình Web',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await api.getMyCourses();
    if (res.success && res.data) {
      setCourses(res.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (course?: ICourse) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        objective: course.objective,
        price: course.price,
        originalPrice: course.originalPrice,
        category: course.category,
        level: course.level,
        thumbnail: course.thumbnail
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        objective: '',
        price: 990000,
        originalPrice: 1500000,
        category: 'Lập Trình Web',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      // Update (IN-KH02)
      await api.updateCourse(editingCourse.id, formData);
    } else {
      // Create (IN-KH01)
      await api.createCourse(formData);
    }
    setShowModal(false);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này (IN-KH03)?')) return;
    await api.deleteCourse(id);
    fetchCourses();
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Danh Sách Khóa Học Của Tôi</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
          <Plus size={16} /> Tạo Khóa Học Mới (IN-KH01)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Khóa học</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Học viên</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={course.thumbnail} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                        <div>
                          <strong style={{ fontSize: 14 }}>{course.title}</strong>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{course.category}</span></td>
                    <td><strong>{formatVND(course.price)}</strong></td>
                    <td>{course.enrolledCount}</td>
                    <td>
                      {course.status === 'approved' && <span className="badge badge-success"><CheckCircle size={12} /> Đã Duyệt</span>}
                      {course.status === 'pending_approval' && <span className="badge badge-warning"><Clock size={12} /> Chờ Duyệt</span>}
                      {course.status === 'rejected' && <span className="badge badge-danger"><AlertCircle size={12} /> Từ Chối</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link to={`/provider/courses/${course.id}/lessons`} className="btn btn-secondary btn-sm" title="Quản lý bài giảng">
                          <Video size={14} /> Bài giảng
                        </Link>
                        <button onClick={() => handleOpenModal(course)} className="btn btn-secondary btn-sm" title="Chỉnh sửa">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(course.id)} className="btn btn-danger btn-sm" title="Xóa">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Tạo/Sửa */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editingCourse ? 'Chỉnh Sửa Khóa Học (IN-KH02)' : 'Tạo Khóa Học Mới (IN-KH01)'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên khóa học *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả khóa học *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mục tiêu học tập *</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Giá bán (VND) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá gốc (VND)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Lập Trình Web">Lập Trình Web</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Trình độ</label>
                  <select
                    className="form-select"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  >
                    <option value="Beginner">Beginner (Cơ bản)</option>
                    <option value="Intermediate">Intermediate (Trung cấp)</option>
                    <option value="Advanced">Advanced (Nâng cao)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Link ảnh thumbnail (URL)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCourse ? 'Lưu Thay Đổi' : 'Gửi Phê Duyệt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
