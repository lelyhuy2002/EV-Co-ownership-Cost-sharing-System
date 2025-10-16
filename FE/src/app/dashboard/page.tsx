"use client";

import React, { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './dashboard.module.css';
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

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

  if (!user) return null;

  return (
    <DashboardLayout active="index">
      {/* Header */}
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
    </DashboardLayout>
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

// Bar Chart Component
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
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

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

      {data.map((item, i) => {
        const barHeight = ((item.trips / maxValue) * (height - padding * 2));
        const x = padding + i * (barWidth + 10) + 5;
        const y = height - padding - barHeight;
        const isHovered = hoveredIndex === i;

        return (
          <g key={i}>
            <rect
              x={x}
              y={animate ? y : height - padding}
              width={barWidth}
              height={animate ? barHeight : 0}
              fill="url(#barGradient)"
              rx="6"
              style={{
                transition: `all 0.9s ease ${i * 0.1}s`,
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${x + barWidth/2}px ${height - padding}px`
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            <text
              x={x + barWidth / 2}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
              fontWeight="600"
            >
              {item.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
