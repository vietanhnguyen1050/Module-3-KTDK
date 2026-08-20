import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ILesson } from '../../types';
import { Plus, Edit2, Trash2, ArrowLeft, PlayCircle, Video } from 'lucide-react';

export const LessonManagement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:00',
    order: 1
  });

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    if (!courseId) return;
    setLoading(true);
    const res = await api.getProviderLessons(courseId);
    if (res.success && res.data) {
      setLessons(res.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (lesson?: ILesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '15:00',
        order: lessons.length + 1
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    if (editingLesson) {
      await api.updateLesson(editingLesson.id, formData);
    } else {
      await api.createLesson(courseId, formData);
    }
    setShowModal(false);
    fetchLessons();
  };

  const handleDelete = async (lessonId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài giảng này?')) return;
    await api.deleteLesson(lessonId);
    fetchLessons();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Link to="/provider/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
            <ArrowLeft size={14} /> Quay lại danh sách khóa học
          </Link>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Quản Lý Bài Giảng & Video (IN-KH04)</h2>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
          <Plus size={16} /> Thêm Bài Giảng Mới
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
                  <th style={{ width: 80 }}>STT</th>
                  <th>Tiêu đề bài giảng</th>
                  <th>Thời lượng</th>
                  <th>Video Link</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td><strong>#{lesson.order}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <PlayCircle size={18} color="var(--primary)" />
                        <div>
                          <strong style={{ fontSize: 14 }}>{lesson.title}</strong>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lesson.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{lesson.duration}</span></td>
                    <td style={{ fontSize: 12, color: '#3b82f6', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lesson.videoUrl}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleOpenModal(lesson)} className="btn btn-secondary btn-sm" title="Chỉnh sửa">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(lesson.id)} className="btn btn-danger btn-sm" title="Xóa">
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 540, padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              {editingLesson ? 'Chỉnh Sửa Bài Giảng' : 'Thêm Bài Giảng Mới (IN-KH04)'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tiêu đề bài học *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Bài 1: Cài đặt môi trường"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả bài giảng</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Thời lượng</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: 15:30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Thứ tự bài học</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Link nhúng Video (YouTube / Vimeo / CDN Embed)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLesson ? 'Lưu Thay Đổi' : 'Thêm Bài Giảng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
