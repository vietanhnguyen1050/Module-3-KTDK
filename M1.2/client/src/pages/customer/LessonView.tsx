import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ILesson, ICourse } from '../../types';
import { PlayCircle, CheckCircle, ArrowLeft, FileText, Download, Check } from 'lucide-react';

export const LessonView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    if (!courseId) return;
    setLoading(true);
    const res = await api.getCourseLessons(courseId);
    if (res.success && res.data) {
      setCourse(res.data.course);
      setLessons(res.data.lessons || []);
      if (res.data.lessons?.length > 0) {
        setActiveLesson(res.data.lessons[0]);
      }
      if (res.data.enrollment?.completedLessonIds) {
        setCompletedIds(res.data.enrollment.completedLessonIds);
      }
    }
    setLoading(false);
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !courseId) return;
    const newCompleted = [...completedIds, activeLesson.id];
    setCompletedIds(newCompleted);

    await api.updateLessonProgress({
      courseId,
      lessonId: activeLesson.id,
      totalLessons: lessons.length
    });
  };

  if (loading) {
    return <div className="page-wrapper container" style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải phòng học trực tuyến...</div>;
  }

  return (
    <div className="page-wrapper container" style={{ maxWidth: 1300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/my-courses" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{course?.title}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Video Player & Lesson Description */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20, background: '#000' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={activeLesson?.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{activeLesson?.title}</h2>
              <button
                onClick={handleMarkComplete}
                className={`btn btn-sm ${completedIds.includes(activeLesson?.id || '') ? 'btn-success' : 'btn-primary'}`}
              >
                {completedIds.includes(activeLesson?.id || '') ? (
                  <>
                    <Check size={16} /> Đã Hoàn Thành
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Đánh Dấu Đã Học Xong
                  </>
                )}
              </button>
            </div>

            <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
              {activeLesson?.description}
            </p>

            {activeLesson?.resources && activeLesson.resources.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📎 Tài liệu đính kèm:</h4>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {activeLesson.resources.map((res, i) => (
                    <a
                      key={i}
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Tải xuống: ${res}`); }}
                      className="btn btn-secondary btn-sm"
                    >
                      <FileText size={14} />
                      <span>{res}</span>
                      <Download size={14} style={{ marginLeft: 4 }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Lesson List */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            Danh Sách Bài Học ({lessons.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lessons.map((lesson, idx) => {
              const isCurrent = activeLesson?.id === lesson.id;
              const isDone = completedIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: isCurrent ? 'var(--primary-light)' : 'transparent',
                    border: isCurrent ? '1px solid var(--primary)' : '1px solid transparent',
                    textAlign: 'left',
                    color: isCurrent ? 'var(--primary)' : 'var(--text-main)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isDone ? (
                      <CheckCircle size={18} color="var(--success)" />
                    ) : (
                      <PlayCircle size={18} color={isCurrent ? 'var(--primary)' : '#94a3b8'} />
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500 }}>{lesson.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lesson.duration}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
