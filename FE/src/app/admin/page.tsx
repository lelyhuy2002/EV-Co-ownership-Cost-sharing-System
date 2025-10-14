"use client";

import React, { useEffect, useState, memo } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import styles from './admin.module.css';
import { Users, Car, TrendingUp, FileText, BarChart3, TrendingUp as LineChart, PieChart, Activity } from 'lucide-react';

// Mock data for EV Co-ownership Dashboard
const mockData = {
  kpis: {
    totalUsers: 1247,
    activeVehicles: 89,
  },
  // Chart data for trips/bookings by month (Bar Chart)
  monthlyTrips: [
    { month: 'T1', trips: 145 },
    { month: 'T2', trips: 178 },
    { month: 'T3', trips: 234 },
    { month: 'T4', trips: 198 },
    { month: 'T5', trips: 267 },
    { month: 'T6', trips: 312 },
    { month: 'T7', trips: 289 },
    { month: 'T8', trips: 345 },
    { month: 'T9', trips: 298 },
    { month: 'T10', trips: 378 },
    { month: 'T11', trips: 412 },
    { month: 'T12', trips: 456 },
  ],
  // User growth data (Line Chart)
  userGrowth: [
    { month: 'T1', users: 450 },
    { month: 'T2', users: 523 },
    { month: 'T3', users: 612 },
    { month: 'T4', users: 734 },
    { month: 'T5', users: 856 },
    { month: 'T6', users: 978 },
    { month: 'T7', users: 1045 },
    { month: 'T8', users: 1123 },
    { month: 'T9', users: 1189 },
    { month: 'T10', users: 1234 },
    { month: 'T11', users: 1247 },
    { month: 'T12', users: 1267 },
  ],
  // Vehicle type distribution (Pie Chart)
  vehicleTypes: [
    { name: 'Tesla', value: 35, color: '#10b981' },
    { name: 'VinFast', value: 28, color: '#06b6d4' },
    { name: 'BYD', value: 22, color: '#84cc16' },
    { name: 'Hyundai', value: 15, color: '#14b8a6' },
  ],
  // Revenue over time (Area Chart)
  revenueData: [
    { month: 'T1', revenue: 45000 },
    { month: 'T2', revenue: 52000 },
    { month: 'T3', revenue: 61000 },
    { month: 'T4', revenue: 58000 },
    { month: 'T5', revenue: 72000 },
    { month: 'T6', revenue: 85000 },
    { month: 'T7', revenue: 79000 },
    { month: 'T8', revenue: 93000 },
    { month: 'T9', revenue: 88000 },
    { month: 'T10', revenue: 102000 },
    { month: 'T11', revenue: 115000 },
    { month: 'T12', revenue: 128000 },
  ],
  recentActivities: [
    {
      id: 1,
      title: 'Xe mới được thêm vào hệ thống',
      desc: 'Tesla Model Y - 51G-99999',
      time: '5 phút trước',
      type: 'vehicle',
    },
    {
      id: 2,
      title: 'Hoàn thành sạc pin',
      desc: 'VinFast VF8 đã sạc đầy 100%',
      time: '15 phút trước',
      type: 'charging',
    },
    {
      id: 3,
      title: 'Tiết kiệm năng lượng mới',
      desc: 'Đã tiết kiệm thêm 150 kWh hôm nay',
      time: '1 giờ trước',
      type: 'energy',
    },
    {
      id: 4,
      title: 'Người dùng mới đăng ký',
      desc: 'Nguyễn Văn A đã tham gia hệ thống',
      time: '2 giờ trước',
      type: 'user',
    },
  ],
};

export default function AdminPageEV() {
  const [kpis, setKpis] = useState<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setKpis(mockData);
    }, 500);
  }, []);

  const handleChartTypeChange = (newType: 'bar' | 'line' | 'pie' | 'area') => {
    setChartType(newType);
    setAnimationKey(prev => prev + 1); // Force re-animation
  };

  return (
    <AdminLayout active="index">
      <div className={styles.header}>
        <h1 className={styles.title}>EV Co-ownership Dashboard</h1>
        <p className={styles.subtitle}>Quản lý hệ thống chia sẻ xe điện</p>
      </div>

      {!kpis ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Tổng người dùng</div>
                  <div className={styles.kpiValue}>{kpis.kpis.totalUsers.toLocaleString()}</div>
                  <div className={styles.kpiDetails}>
                    <Users size={14} />
                    <span>+12% so với tháng trước</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <TrendingUp size={14} />
                    <span>12%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconGreen}>
                  <Users size={28} color="white" />
                </div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Xe đang hoạt động</div>
                  <div className={styles.kpiValue}>{kpis.kpis.activeVehicles}</div>
                  <div className={styles.kpiDetails}>
                    <Car size={14} />
                    <span>Trên tổng số 120 xe</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <TrendingUp size={14} />
                    <span>8%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconBlue}>
                  <Car size={28} color="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Charts Section */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h2 className={styles.sectionTitle}>
                <Activity size={24} style={{display: 'inline', marginRight: '8px'}} />
                Biểu đồ thống kê
              </h2>
              <div className={styles.chartControls}>
                <button
                  className={`${styles.chartButton} ${chartType === 'bar' ? styles.chartButtonActive : ''}`}
                  onClick={() => handleChartTypeChange('bar')}
                >
                  <BarChart3 size={16} style={{display: 'inline', marginRight: '6px'}} />
                  Cột
                </button>
                <button
                  className={`${styles.chartButton} ${chartType === 'line' ? styles.chartButtonActive : ''}`}
                  onClick={() => handleChartTypeChange('line')}
                >
                  <LineChart size={16} style={{display: 'inline', marginRight: '6px'}} />
                  Đường
                </button>
                <button
                  className={`${styles.chartButton} ${chartType === 'pie' ? styles.chartButtonActive : ''}`}
                  onClick={() => handleChartTypeChange('pie')}
                >
                  <PieChart size={16} style={{display: 'inline', marginRight: '6px'}} />
                  Tròn
                </button>
                <button
                  className={`${styles.chartButton} ${chartType === 'area' ? styles.chartButtonActive : ''}`}
                  onClick={() => handleChartTypeChange('area')}
                >
                  <Activity size={16} style={{display: 'inline', marginRight: '6px'}} />
                  Vùng
                </button>
              </div>
            </div>
            <div style={{ height: '350px', position: 'relative', overflow: 'hidden' }}>
              <ChartRenderer
                key={`${chartType}-${animationKey}`}
                type={chartType}
                barData={kpis.monthlyTrips}
                lineData={kpis.userGrowth}
                pieData={kpis.vehicleTypes}
                areaData={kpis.revenueData}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}><FileText size={24} /></span>
              <span>Hoạt động gần đây</span>
            </h2>
            <ul className={styles.activityList}>
              {kpis.recentActivities.map((activity: any) => (
                <li key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityHeader}>
                    <div className={styles.activityTitle}>{activity.title}</div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                  <div className={styles.activityDesc}>{activity.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// Chart Renderer Component with animations
function ChartRenderer({ type, barData, lineData, pieData, areaData }: {
  type: 'bar' | 'line' | 'pie' | 'area';
  barData: any[];
  lineData: any[];
  pieData: any[];
  areaData: any[];
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {type === 'bar' && <BarChart data={barData} animate={animate} />}
      {type === 'line' && <LineChartComponent data={lineData} animate={animate} />}
      {type === 'pie' && <PieChartComponent data={pieData} animate={animate} />}
      {type === 'area' && <AreaChart data={areaData} animate={animate} />}
    </div>
  );
}

// Bar Chart Component with Enhanced Animations
function BarChart({ data, animate }: { data: any[]; animate: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => d.trips));
  const width = 1000;
  const height = 350;
  const padding = 60;
  const barWidth = (width - padding * 2) / data.length - 10;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        {/* Main gradient for bars */}
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        
        {/* Hover gradient - brighter */}
        <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        
        {/* Drop shadow filter */}
        <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10b981" floodOpacity="0.3"/>
        </filter>
        
        {/* Glow effect on hover */}
        <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines with fade-in */}
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
            opacity: animate ? 0.6 : 0,
            transition: 'opacity 0.4s ease-out'
          }}
        />
      ))}

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const value = Math.round((1 - ratio) * maxValue);
        return (
          <text
            key={i}
            x={padding - 10}
            y={padding + (height - padding * 2) * ratio + 5}
            textAnchor="end"
            fontSize="11"
            fill="#94a3b8"
            fontWeight="500"
            style={{
              opacity: animate ? 1 : 0,
              transition: `opacity 0.5s ease-out ${i * 0.1}s`
            }}
          >
            {value}
          </text>
        );
      })}

      {/* Bars with staggered animation */}
      {data.map((item, i) => {
        const barHeight = ((item.trips / maxValue) * (height - padding * 2));
        const x = padding + i * (barWidth + 10) + 5;
        const y = height - padding - barHeight;
        const isHovered = hoveredIndex === i;
        const delay = i * 0.12; // 120ms delay between bars

        return (
          <g key={i}>
            {/* Shadow base */}
            <rect
              x={x}
              y={height - padding}
              width={barWidth}
              height={animate ? barHeight : 0}
              fill="#10b981"
              opacity="0.1"
              rx="6"
              style={{
                transition: `all 0.9s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
                transform: animate ? 'translateY(0)' : 'translateY(0)'
              }}
            />
            
            {/* Main bar */}
            <rect
              x={x}
              y={animate ? y : height - padding}
              width={barWidth}
              height={animate ? barHeight : 0}
              fill={isHovered ? "url(#barGradientHover)" : "url(#barGradient)"}
              rx="6"
              filter={isHovered ? "url(#barGlow)" : "url(#barShadow)"}
              style={{
                transition: `all 0.9s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.3s ease-out, filter 0.3s ease-out`,
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
                transformOrigin: `${x + barWidth/2}px ${height - padding}px`
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            
            {/* Tooltip on hover */}
            {isHovered && animate && (
              <g style={{ opacity: 0, animation: 'tooltipFadeIn 0.3s ease-out forwards' }}>
                <rect
                  x={x + barWidth / 2 - 40}
                  y={y - 50}
                  width="80"
                  height="32"
                  rx="8"
                  fill="#1f2937"
                  opacity="0.95"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 38}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#d1d5db"
                  fontWeight="500"
                >
                  {item.month}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 26}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#10b981"
                  fontWeight="700"
                >
                  {item.trips} chuyến
                </text>
              </g>
            )}
            
            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill={isHovered ? "#10b981" : "#64748b"}
              fontWeight={isHovered ? "700" : "600"}
              style={{
                opacity: animate ? 1 : 0,
                transition: `all 0.4s ease-out ${delay + 0.6}s`
              }}
            >
              {item.month}
            </text>
            
            {/* Value label on top */}
            {animate && !isHovered && (
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#10b981"
                fontWeight="700"
                style={{
                  opacity: 0,
                  animation: `valueFadeIn 0.6s ease-out ${delay + 0.9}s forwards`
                }}
              >
                {item.trips}
              </text>
            )}
          </g>
        );
      })}

      <style jsx>{`
        @keyframes valueFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
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

// Line Chart Component with Enhanced Animations
function LineChartComponent({ data, animate }: { data: any[]; animate: boolean }) {
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
        {/* Gradient for line - cyan to green */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        
        {/* Glow gradient */}
        <linearGradient id="lineGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        
        {/* Drop shadow for line */}
        <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4"/>
        </filter>
        
        {/* Glow effect for hover */}
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Point glow */}
        <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines with fade-in */}
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

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const value = Math.round((1 - ratio) * maxValue);
        return (
          <text
            key={i}
            x={padding - 10}
            y={padding + (height - padding * 2) * ratio + 5}
            textAnchor="end"
            fontSize="11"
            fill="#94a3b8"
            fontWeight="500"
            style={{
              opacity: startAnimation ? 1 : 0,
              transition: `opacity 0.5s ease-out ${i * 0.1}s`
            }}
          >
            {value}
          </text>
        );
      })}

      {/* Hidden reference path to calculate length */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke="none"
      />

      {/* Background glow when hovering chart */}
      {chartHovered && startAnimation && pathLength > 0 && (
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGlowGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          style={{
            animation: 'glowPulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Main line with drawing animation */}
      {pathLength > 0 && (
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={chartHovered ? 4 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={chartHovered ? "url(#lineGlow)" : "url(#lineShadow)"}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: startAnimation ? 0 : pathLength,
            transition: `stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.5, 1), stroke-width 0.3s ease-out, filter 0.3s ease-out`
          }}
        />
      )}

      {/* Data points with staggered animation */}
      {points.map((p, i) => {
        const isHovered = hoveredIndex === i;
        // Points appear as line draws to their position
        // Total line drawing time is 2s, so distribute points across that time
        const delay = (i / (points.length - 1)) * 1.8; // Appear during line drawing (0s to 1.8s)

        return (
          <g key={i}>
            {/* Outer ring on hover */}
            {isHovered && startAnimation && (
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                opacity="0.3"
                style={{
                  animation: 'ringExpand 1s ease-out infinite'
                }}
              />
            )}
            
            {/* Main point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={startAnimation ? (isHovered ? 9 : 6) : 0}
              fill="url(#lineGradient)"
              filter={isHovered ? "url(#pointGlow)" : "none"}
              style={{
                transition: `all 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, r 0.3s ease-out`,
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: `${p.x}px ${p.y}px`
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            
            {/* White center dot */}
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
            
            {/* Tooltip on hover */}
            {isHovered && startAnimation && (
              <g style={{ opacity: 0, animation: 'tooltipFadeIn 0.3s ease-out forwards' }}>
                <rect
                  x={p.x - 55}
                  y={p.y - 60}
                  width="110"
                  height="44"
                  rx="10"
                  fill="#1f2937"
                  opacity="0.96"
                  filter="url(#lineShadow)"
                />
                <text
                  x={p.x}
                  y={p.y - 42}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#d1d5db"
                  fontWeight="500"
                >
                  {p.label} - Người dùng
                </text>
                <text
                  x={p.x}
                  y={p.y - 26}
                  textAnchor="middle"
                  fontSize="16"
                  fill="#10b981"
                  fontWeight="700"
                >
                  {p.value.toLocaleString()}
                </text>
              </g>
            )}
            
            {/* X-axis label */}
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

      <style jsx>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ringExpand {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </svg>
  );
}

// Pie Chart Component
function PieChartComponent({ data, animate }: { data: any[]; animate: boolean }) {
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
    </svg>
  );
}

// Area Chart Component
function AreaChart({ data, animate }: { data: any[]; animate: boolean }) {
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
