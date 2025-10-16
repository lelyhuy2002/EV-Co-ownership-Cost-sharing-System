"use client";

import React, { useEffect, useState } from 'react';

// Line Chart Component with Enhanced Animations
export function LineChartComponent({ data, animate }: { data: any[]; animate: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartHovered, setChartHovered] = useState(false);
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  
  const maxValue = Math.max(...data.map(d => d.users));
  const width = 1000;
  const height = 350;
  const padding = 60;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((d.users / maxValue) * (height - padding * 2)),
    value: d.users,
    label: d.month
  }));

  // Calculate path for smooth curve
  const linePath = points.map((p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return ` Q ${prev.x},${prev.y} ${cx},${(prev.y + p.y) / 2} T ${p.x},${p.y}`;
  }).join('');

  // Get actual path length when component mounts
  React.useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      // Start animation after path length is calculated
      setTimeout(() => setStartAnimation(true), 50);
    }
  }, [linePath, animate]);

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={() => setChartHovered(true)}
      onMouseLeave={() => setChartHovered(false)}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        
        <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4"/>
        </filter>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + (height - padding * 2) * ratio}
          x2={width - padding}
          y2={padding + (height - padding * 2) * ratio}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
          style={{
            opacity: startAnimation ? 0.6 : 0,
            transition: 'opacity 0.4s ease-out'
          }}
        />
      ))}

      {/* Hidden reference path to calculate length */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke="none"
      />

      {/* Main line with drawing animation */}
      {pathLength > 0 && (
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={chartHovered ? 4 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineShadow)"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: startAnimation ? 0 : pathLength,
            transition: `stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.5, 1), stroke-width 0.3s ease-out`
          }}
        />
      )}

      {/* Data points */}
      {points.map((p, i) => {
        const isHovered = hoveredIndex === i;
        const delay = (i / (points.length - 1)) * 1.8;

        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={startAnimation ? (isHovered ? 9 : 6) : 0}
              fill="url(#lineGradient)"
              style={{
                transition: `all 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, r 0.3s ease-out`,
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: `${p.x}px ${p.y}px`
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            
            <circle
              cx={p.x}
              cy={p.y}
              r={startAnimation ? (isHovered ? 3 : 2) : 0}
              fill="white"
              style={{
                transition: `all 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, r 0.3s ease-out`,
                pointerEvents: 'none'
              }}
            />
            
            <text
              x={p.x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="11"
              fill={isHovered ? "#10b981" : "#64748b"}
              fontWeight={isHovered ? "700" : "600"}
              style={{
                opacity: startAnimation ? 1 : 0,
                transition: `all 0.4s ease-out ${delay + 0.3}s`
              }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Pie Chart Component
export function PieChartComponent({ data, animate }: { data: any[]; animate: boolean }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const cx = 500;
  const cy = 175;
  const radius = 120;

  let currentAngle = -90;
  const slices = data.map(item => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...item, startAngle, angle };
  });

  const polarToCartesian = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180)
  });

  return (
    <svg viewBox="0 0 1000 350" style={{ width: '100%', height: '100%' }}>
      {slices.map((slice, i) => {
        const start = polarToCartesian(slice.startAngle, radius);
        const end = polarToCartesian(slice.startAngle + slice.angle, radius);
        const largeArc = slice.angle > 180 ? 1 : 0;
        const path = [
          `M ${cx} ${cy}`,
          `L ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
          'Z'
        ].join(' ');

        const midAngle = slice.startAngle + slice.angle / 2;
        const labelPos = polarToCartesian(midAngle, radius * 0.7);

        return (
          <g key={i}>
            <path
              d={path}
              fill={slice.color}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? 'scale(1)' : 'scale(0)',
                transformOrigin: `${cx}px ${cy}px`,
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <title>{slice.name}: {slice.value}%</title>
            </path>
            {animate && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="700"
                style={{
                  opacity: 0,
                  animation: `fadeIn 0.5s ${i * 0.1 + 0.6}s forwards`
                }}
              >
                {slice.value}%
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      {data.map((item, i) => (
        <g key={i} transform={`translate(700, ${80 + i * 40})`}>
          <rect
            width="24"
            height="24"
            rx="6"
            fill={item.color}
            style={{
              opacity: animate ? 1 : 0,
              transition: `opacity 0.5s ease ${i * 0.1 + 0.3}s`
            }}
          />
          <text
            x="35"
            y="17"
            fontSize="14"
            fill="#4b5563"
            fontWeight="600"
            style={{
              opacity: animate ? 1 : 0,
              transition: `opacity 0.5s ease ${i * 0.1 + 0.3}s`
            }}
          >
            {item.name} ({item.value}%)
          </text>
        </g>
      ))}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </svg>
  );
}

// Area Chart Component
export function AreaChart({ data, animate }: { data: any[]; animate: boolean }) {
  const maxValue = Math.max(...data.map(d => d.revenue));
  const width = 1000;
  const height = 350;
  const padding = 60;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((d.revenue / maxValue) * (height - padding * 2)),
    value: d.revenue,
    label: d.month
  }));

  const linePath = points.map((p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return ` Q ${prev.x},${prev.y} ${cx},${(prev.y + p.y) / 2} T ${p.x},${p.y}`;
  }).join('');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="areaLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + (height - padding * 2) * ratio}
          x2={width - padding}
          y2={padding + (height - padding * 2) * ratio}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Area */}
      <path
        d={areaPath}
        fill="url(#areaFillGradient)"
        style={{
          opacity: animate ? 1 : 0,
          transition: 'opacity 1s ease-out 0.3s'
        }}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#areaLineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: animate ? 'none' : 2000,
          strokeDashoffset: animate ? 0 : 2000,
          transition: 'stroke-dashoffset 1.5s ease-out'
        }}
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={animate ? 5 : 0}
            fill="url(#areaLineGradient)"
            style={{
              transition: `all 0.5s ease ${i * 0.08 + 1}s`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.setAttribute('r', '8');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.setAttribute('r', '5');
            }}
          >
            <title>{p.label}: {p.value.toLocaleString()}đ</title>
          </circle>
          <text
            x={p.x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
            fontWeight="600"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
