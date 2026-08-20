import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ICourse, ILesson } from '../../types';
import { Check, X, Eye, BookOpen, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const CourseApproval: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await api.getAdminCourses();
    if (res.success && res.data) {
      setCourses(res.data);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string, status: 'approved' | 'rejected' | 'disabled') => {
    await api.approveCourse(id, status);
    fetchCourses();
    if (showModal) setShowModal(false);
  };

  const handleViewContent = async (course: ICourse) => {
    setSelectedCourse(course);
    const res = await api.getAdminCourseContent(course.id);
    if (res.success && res.data) {
      setCourseLessons(res.data.lessons || []);
    }
    setShowModal(true);
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Duyệt & Quản Lý Khóa Học (AD-KH01 / 02 / 03)</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Kiểm duyệt nội dung bài giảng, video và trạng thái công khai của các khóa học
        </p>
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
                  <th>Nhà Cung Cấp</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác kiểm duyệt</th>
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
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{course.category} • {course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td><strong>{course.providerName}</strong></td>
                    <td>{formatVND(course.price)}</td>
                    <td>
                      {course.status === 'approved' && <span className="badge badge-success"><CheckCircle size={12} /> Đã Duyệt</span>}
                      {course.status === 'pending_approval' && <span className="badge badge-warning"><Clock size={12} /> Chờ Phê Duyệt</span>}
                      {course.status === 'rejected' && <span className="badge badge-danger"><AlertCircle size={12} /> Bị Từ Chối</span>}
                      {course.status === 'disabled' && <span className="badge badge-danger">Vô Hiệu Hóa</span>}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleViewContent(course)}
                          className="btn btn-secondary btn-sm"
                          title="Kiểm tra nội dung bài giảng (AD-KH03)"
                        >
                          <Eye size={14} /> Xem nội dung
                        </button>

                        {course.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(course.id, 'approved')}
                              className="btn btn-success btn-sm"
                              title="Duyệt khóa học (AD-KH01)"
                            >
                              <Check size={14} /> Duyệt
                            </button>
                            <button
                              onClick={() => handleApprove(course.id, 'rejected')}
                              className="btn btn-danger btn-sm"
                              title="Từ chối"
                            >
                              <X size={14} /> Từ chối
                            </button>
                          </>
                        )}

                        {course.status === 'approved' && (
                          <button
                            onClick={() => handleApprove(course.id, 'disabled')}
                            className="btn btn-danger btn-sm"
                            title="Vô hiệu hóa khóa học"
                          >
                            Tắt
                          </button>
                        )}
                        {course.status === 'disabled' && (
                          <button
                            onClick={() => handleApprove(course.id, 'approved')}
                            className="btn btn-success btn-sm"
                            title="Mở lại khóa học"
                          >
                            Bật lại
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
      )}

      {/* Modal Kiểm Tra Nội Dung (AD-KH03) */}
      {showModal && selectedCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>Kiểm Tra Nội Dung Khóa Học (AD-KH03)</h3>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{selectedCourse.title}</h4>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{selectedCourse.description}</p>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                🎯 <strong>Mục tiêu:</strong> {selectedCourse.objective}
              </div>
            </div>

            <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
              Danh sách bài giảng & Video đính kèm ({courseLessons.length}):
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {courseLessons.length > 0 ? (
                courseLessons.map((l) => (
                  <div key={l.id} className="card" style={{ padding: 14, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{l.title}</strong>
                      <span className="badge badge-primary">{l.duration}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{l.description}</div>
                    <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>🔗 Embed: {l.videoUrl}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có bài giảng nào được thêm.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Đóng</button>
              <button onClick={() => handleApprove(selectedCourse.id, 'approved')} className="btn btn-success">
                <Check size={16} /> Phê Duyệt Khóa Học Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
