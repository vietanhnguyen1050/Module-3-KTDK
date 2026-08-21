import React from 'react';
import { IWidget } from '../../types';
import { TrendingUp, TrendingDown, MoreVertical, Trash2 } from 'lucide-react';

export const ChartWidget: React.FC<{ widget: IWidget; onDelete?: (id: string) => void }> = ({ widget, onDelete }) => {
  const { type, title, config, size } = widget;

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'widget-small';
      case 'medium': return 'widget-medium';
      case 'large': return 'widget-large';
      case 'full': return 'widget-full';
      default: return 'widget-medium';
    }
  };

  // Render Metric Card
  if (type === 'metric') {
    return (
      <div className={`card ${getSizeClass()}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{config.metricLabel || title}</span>
          {onDelete && (
            <button onClick={() => onDelete(widget.id)} style={{ color: 'var(--text-muted)' }} title="Xóa widget">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div style={{ margin: '14px 0' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{config.metricValue}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: config.isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {config.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{config.metricChange}</span>
        </div>
      </div>
    );
  }

  // Render Line / Area Chart (SVG)
  if (type === 'line' || type === 'area') {
    const data = config.chartData || [30, 45, 60, 40, 80, 95, 120];
    const labels = config.chartLabels || ['1', '2', '3', '4', '5', '6', '7'];
    const maxVal = Math.max(...data) * 1.15;
    const minVal = Math.min(...data) * 0.85;
    const range = maxVal - minVal || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * 500 + 40;
      const y = 200 - ((val - minVal) / range) * 160;
      return `${x},${y}`;
    }).join(' ');

    const areaPath = `M 40,200 L ${points} L 540,200 Z`;

    return (
      <div className={`card ${getSizeClass()}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3>
          {onDelete && (
            <button onClick={() => onDelete(widget.id)} style={{ color: 'var(--text-muted)' }} title="Xóa widget">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div style={{ width: '100%', height: 220, position: 'relative' }}>
          <svg viewBox="0 0 580 230" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id={`grad_${widget.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={config.color || 'var(--primary)'} stopOpacity="0.4" />
                <stop offset="100%" stopColor={config.color || 'var(--primary)'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[40, 90, 140, 190].map((y, i) => (
              <line key={i} x1="40" y1={y} x2="540" y2={y} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            {/* Area Fill */}
            {type === 'area' && (
              <path d={areaPath} fill={`url(#grad_${widget.id})`} />
            )}

            {/* Line Path */}
            <polyline
              fill="none"
              stroke={config.color || 'var(--primary)'}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data Dots */}
            {data.map((val, idx) => {
              const x = (idx / (data.length - 1)) * 500 + 40;
              const y = 200 - ((val - minVal) / range) * 160;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" fill="white" stroke={config.color || 'var(--primary)'} strokeWidth="3" />
                  <text x={x} y="225" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
                    {labels[idx]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  // Render Bar Chart (SVG)
  if (type === 'bar') {
    const data = config.chartData || [45, 120, 85, 230, 95];
    const labels = config.chartLabels || ['A', 'B', 'C', 'D', 'E'];
    const maxVal = Math.max(...data) * 1.2 || 1;

    return (
      <div className={`card ${getSizeClass()}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3>
          {onDelete && (
            <button onClick={() => onDelete(widget.id)} style={{ color: 'var(--text-muted)' }} title="Xóa widget">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div style={{ width: '100%', height: 220 }}>
          <svg viewBox="0 0 500 220" style={{ width: '100%', height: '100%' }}>
            {data.map((val, idx) => {
              const barHeight = (val / maxVal) * 160;
              const x = idx * (460 / data.length) + 40;
              const y = 180 - barHeight;
              const width = Math.min(48, 380 / data.length);

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={barHeight}
                    rx="6"
                    fill={config.color || '#3b82f6'}
                  />
                  <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                    {val}
                  </text>
                  <text x={x + width / 2} y="205" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
                    {labels[idx]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  // Render Donut Chart
  if (type === 'donut') {
    const data = config.chartData || [42, 28, 15, 10, 5];
    const labels = config.chartLabels || ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'];
    const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

    return (
      <div className={`card ${getSizeClass()}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3>
          {onDelete && (
            <button onClick={() => onDelete(widget.id)} style={{ color: 'var(--text-muted)' }} title="Xóa widget">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 200, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
              {/* Slices simulation */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#4f46e5" strokeWidth="18" strokeDasharray="100 150" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0ea5e9" strokeWidth="18" strokeDasharray="65 180" strokeDashoffset="-100" />
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="18" strokeDasharray="35 210" strokeDashoffset="-165" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
              100%
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            {labels.map((lbl, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: colors[idx % colors.length] }} />
                <span>{lbl}: <strong>{data[idx]}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
