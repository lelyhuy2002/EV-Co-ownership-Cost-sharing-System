"use client";

import { useEffect, useState } from 'react';
import AdminLayoutEV from '@/components/Admin/AdminLayoutEV';
import styles from './admin_ev.module.css';

// Mock data for EV Dashboard
const mockData = {
  kpis: {
    totalUsers: 1247,
    activeVehicles: 89,
    energySaved: 12450, // kWh
    co2Reduced: 8.5, // tons
  },
  vehicles: [
    {
      id: 1,
      name: 'Tesla Model 3',
      licensePlate: '30A-12345',
      battery: 85,
      status: 'active',
      range: 420,
      lastCharge: '2 giờ trước',
    },
    {
      id: 2,
      name: 'VinFast VF8',
      licensePlate: '51F-67890',
      battery: 45,
      status: 'charging',
      range: 180,
      lastCharge: 'Đang sạc',
    },
    {
      id: 3,
      name: 'BYD Atto 3',
      licensePlate: '29B-54321',
      battery: 20,
      status: 'maintenance',
      range: 80,
      lastCharge: '1 ngày trước',
    },
  ],
  energyData: Array.from({ length: 12 }, (_, i) => ({
    month: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][i],
    energySaved: Math.random() * 5000 + 3000,
    co2Reduced: Math.random() * 3 + 1,
  })),
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
  const [chartView, setChartView] = useState<'energy' | 'co2'>('energy');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setKpis(mockData);
    }, 500);
  }, []);

  return (
    <AdminLayoutEV active="index">
      <div className={styles.header}>
        <h1 className={styles.title}>EV Management Dashboard</h1>
        <p className={styles.subtitle}>Quản lý xe điện và năng lượng xanh</p>
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
                    <span>👥</span>
                    <span>+12% so với tháng trước</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>12%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconGreen}>👥</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Xe đang hoạt động</div>
                  <div className={styles.kpiValue}>{kpis.kpis.activeVehicles}</div>
                  <div className={styles.kpiDetails}>
                    <span>🚗</span>
                    <span>Trên tổng số 120 xe</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>8%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconBlue}>🚗</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>Năng lượng tiết kiệm</div>
                  <div className={styles.kpiValue}>{kpis.kpis.energySaved.toLocaleString()}</div>
                  <div className={styles.kpiDetails}>
                    <span>⚡</span>
                    <span>kWh tháng này</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>24%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconTeal}>⚡</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div className={styles.kpiInfo}>
                  <div className={styles.kpiLabel}>CO₂ giảm thiểu</div>
                  <div className={styles.kpiValue}>{kpis.kpis.co2Reduced}</div>
                  <div className={styles.kpiDetails}>
                    <span>🌱</span>
                    <span>tấn tháng này</span>
                  </div>
                  <div className={styles.kpiTrend + ' ' + styles.kpiTrendUp}>
                    <span>↑</span>
                    <span>18%</span>
                  </div>
                </div>
                <div className={styles.kpiIcon + ' ' + styles.kpiIconLime}>🌱</div>
              </div>
            </div>
          </div>

          {/* Vehicle Status Section */}
          <div className={styles.vehicleSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🚗</span>
              <span>Trạng thái xe điện</span>
            </h2>
            <div className={styles.vehicleGrid}>
              {kpis.vehicles.map((vehicle: any) => (
                <div key={vehicle.id} className={styles.vehicleCard}>
                  <div className={styles.vehicleHeader}>
                    <div className={styles.vehicleName}>{vehicle.name}</div>
                    <div
                      className={`${styles.vehicleStatus} ${
                        vehicle.status === 'active'
                          ? styles.statusActive
                          : vehicle.status === 'charging'
                          ? styles.statusCharging
                          : styles.statusMaintenance
                      }`}
                    >
                      {vehicle.status === 'active'
                        ? '✓ Hoạt động'
                        : vehicle.status === 'charging'
                        ? '🔌 Đang sạc'
                        : '🔧 Bảo trì'}
                    </div>
                  </div>
                  <div className={styles.vehicleStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Biển số</div>
                      <div className={styles.statValue} style={{ fontSize: '14px' }}>
                        {vehicle.licensePlate}
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>Quãng đường</div>
                      <div className={styles.statValue}>{vehicle.range} km</div>
                    </div>
                  </div>
                  <div className={styles.batteryProgress}>
                    <div className={styles.batteryLabel}>
                      <span>🔋 Pin</span>
                      <span>{vehicle.battery}%</span>
                    </div>
                    <div className={styles.batteryBar}>
                      <div
                        className={styles.batteryFill}
                        style={{ width: `${vehicle.battery}%` }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                    Lần sạc cuối: {vehicle.lastCharge}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Chart Section */}
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>
                <span className={styles.sectionIcon}>📊</span>
                <span>Báo cáo năng lượng tiết kiệm</span>
              </h2>
              <div className={styles.chartControls}>
                <button
                  className={`${styles.chartButton} ${
                    chartView === 'energy' ? styles.chartButtonActive : ''
                  }`}
                  onClick={() => setChartView('energy')}
                >
                  ⚡ Năng lượng (kWh)
                </button>
                <button
                  className={`${styles.chartButton} ${
                    chartView === 'co2' ? styles.chartButtonActive : ''
                  }`}
                  onClick={() => setChartView('co2')}
                >
                  🌱 CO₂ (tấn)
                </button>
              </div>
            </div>
            <div style={{ height: '280px', position: 'relative' }}>
              <EnergyChart data={kpis.energyData} view={chartView} />
            </div>
            <div className={styles.energyBadge} style={{ marginTop: '20px' }}>
              <span className={styles.energyIcon}>🌍</span>
              <span>
                Tương đương với việc trồng {Math.round(kpis.kpis.co2Reduced * 45)} cây xanh
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📋</span>
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
    </AdminLayoutEV>
  );
}

// Energy Chart Component
function EnergyChart({ data, view }: { data: any[]; view: 'energy' | 'co2' }) {
  const maxValue = Math.max(
    ...data.map((d) => (view === 'energy' ? d.energySaved : d.co2Reduced))
  );
  const width = 1000;
  const height = 280;
  const padding = 40;

  const points = data.map((d, i) => {
    const value = view === 'energy' ? d.energySaved : d.co2Reduced;
    return {
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: height - padding - ((value / maxValue) * (height - padding * 2)),
      value: value,
      label: d.month,
    };
  });

  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return ` Q ${prev.x},${prev.y} ${cx},${(prev.y + p.y) / 2} T ${p.x},${p.y}`;
    })
    .join('');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="evGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="evAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Area */}
      <path d={areaPath} fill="url(#evAreaGradient)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#evGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="6"
            fill="url(#evGradient)"
            style={{ cursor: 'pointer' }}
          />
          <text
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
            fontWeight="600"
          >
            {p.label}
          </text>
          <title>
            {view === 'energy' ? 'Năng lượng' : 'CO₂'}: {p.value.toFixed(1)}{' '}
            {view === 'energy' ? 'kWh' : 'tấn'}
          </title>
        </g>
      ))}
    </svg>
  );
}
