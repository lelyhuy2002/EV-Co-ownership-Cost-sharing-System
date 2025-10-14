"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './dashboard.module.css';
import Header from '@/components/Header/Header';

// Mock data
const mockVehicles = [
  {
    id: 1,
    amount: '28,572.00',
    currency: 'VNĐ',
    status: 'Active',
    number: '****  ****  ****  2879',
    type: 'Tesla Model 3',
    brand: 'Mastercard',
    color: 'master'
  },
  {
    id: 2,
    amount: '12,148.00',
    currency: 'VNĐ',
    status: 'Disabled',
    number: '****  ****  ****  2879',
    type: 'VinFast VF8',
    brand: 'VISA',
    color: 'visa'
  },
  {
    id: 3,
    amount: '58,629.00',
    currency: 'VNĐ',
    status: 'Disabled',
    number: '****  ****  ****  2879',
    type: 'BYD Atto 3',
    brand: 'AMEX',
    color: 'amex'
  },
];

const mockTransactions = [
  {
    id: 'DEV12345',
    customerName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    date: '28 Dec 2025',
    amount: '2,850,000',
    status: 'Success',
  },
  {
    id: 'DEV54321',
    customerName: 'Trần Thị B',
    email: 'tranthib@email.com',
    date: '14 Feb 2025',
    amount: '1,235,000',
    status: 'Pending',
  },
  {
    id: 'DEV67890',
    customerName: 'Lê Văn C',
    email: 'levanc@email.com',
    date: '20 Jan 2025',
    amount: '3,150,000',
    status: 'Success',
  },
];

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  income: Math.random() * 40000 + 20000,
  expense: Math.random() * 30000 + 10000,
}));

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [chartView, setChartView] = useState<'income' | 'expenses'>('income');
  const [chartPeriod, setChartPeriod] = useState('monthly');

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>EV Share</div>
            <div className={styles.logoSubtitle}>Co-ownership App</div>
          </div>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>MENU</div>
          <nav className={styles.menuItems}>
            <a
              href="#"
              className={`${styles.menuItem} ${activeMenu === 'dashboard' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <span className={styles.menuItemIcon}>📊</span>
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('transactions')}
            >
              <span className={styles.menuItemIcon}>💳</span>
              <span>Giao dịch</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('autopay')}
            >
              <span className={styles.menuItemIcon}>🔄</span>
              <span>Thanh toán tự động</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('goals')}
            >
              <span className={styles.menuItemIcon}>🎯</span>
              <span>Mục tiêu</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('settings')}
            >
              <span className={styles.menuItemIcon}>⚙️</span>
              <span>Cài đặt</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('message')}
            >
              <span className={styles.menuItemIcon}>✉️</span>
              <span>Tin nhắn</span>
              <span className={styles.menuItemBadge}>2</span>
            </a>
            <a
              href="#"
              className={styles.menuItem}
              onClick={() => setActiveMenu('investment')}
            >
              <span className={styles.menuItemIcon}>📈</span>
              <span>Đầu tư</span>
            </a>
          </nav>
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>SUPPORT</div>
          <nav className={styles.menuItems}>
            <a href="#" className={styles.menuItem}>
              <span className={styles.menuItemIcon}>❓</span>
              <span>Hỗ trợ</span>
            </a>
            <a href="#" className={styles.menuItem} onClick={logout}>
              <span className={styles.menuItemIcon}>🚪</span>
              <span>Đăng xuất</span>
            </a>
          </nav>
        </div>

        <div className={styles.proSection}>
          <div className={styles.proTitle}>
            <span>👑</span>
            <span>PRO</span>
          </div>
          <div className={styles.proText}>
            Nhắc nhở thoát dự án, tìm kiếm nâng cao và nhiều hơn nữa
          </div>
          <button className={styles.proButton}>Nâng cấp Pro</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Shared Header component (visible) */}
        <Header headerHidden={false} currentSection={2} />

        {/* KPI Cards */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div>
                <div className={styles.kpiTitle}>Tổng số dư</div>
                <div className={styles.kpiValue}>82,620</div>
                <div className={styles.kpiChange + ' ' + styles.kpiChangeUp}>
                  <span>↑</span>
                  <span>4% so với tháng trước</span>
                </div>
              </div>
              <div>
                <div className={styles.kpiIconWrapper}>💰</div>
                <button className={styles.kpiMenu}>⋯</button>
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div>
                <div className={styles.kpiTitle}>Tổng chi tiêu</div>
                <div className={styles.kpiValue}>54,870</div>
                <div className={styles.kpiChange + ' ' + styles.kpiChangeDown}>
                  <span>↓</span>
                  <span>3% so với tháng trước</span>
                </div>
              </div>
              <div>
                <div className={styles.kpiIconWrapper}>💳</div>
                <button className={styles.kpiMenu}>⋯</button>
              </div>
            </div>
          </div>

          <div className={styles.cardsSection} style={{ gridColumn: 'span 1' }}>
            <div className={styles.cardsSectionHeader}>
              <div className={styles.cardsSectionTitle}>Xe của tôi</div>
              <button className={styles.addButton}>+ Thêm xe mới</button>
            </div>
          </div>
        </div>

        {/* Vehicles Cards */}
        <div className={styles.cardsSection}>
          <div className={styles.cardsList}>
            {mockVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`${styles.vehicleCard} ${styles['vehicleCard' + vehicle.brand]}`}
              >
                <div className={styles.vehicleCardHeader}>
                  <div>
                    <div className={styles.vehicleCardCurrency}>{vehicle.currency}</div>
                    <div className={styles.vehicleCardAmount}>{vehicle.amount}</div>
                  </div>
                  <div
                    className={`${styles.vehicleCardStatus} ${
                      vehicle.status === 'Disabled' ? styles.vehicleCardStatusDisabled : ''
                    }`}
                  >
                    {vehicle.status}
                  </div>
                </div>
                <div className={styles.vehicleCardNumber}>{vehicle.number}</div>
                <div className={styles.vehicleCardFooter}>
                  <div className={styles.vehicleCardBrand}>{vehicle.brand}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Tổng quan giám sát</div>
            <div className={styles.chartToggle}>
              <button
                className={`${styles.chartToggleButton} ${
                  chartView === 'income' ? styles.chartToggleButtonActive : ''
                }`}
                onClick={() => setChartView('income')}
              >
                Thu nhập
              </button>
              <button
                className={`${styles.chartToggleButton} ${
                  chartView === 'expenses' ? styles.chartToggleButtonActive : ''
                }`}
                onClick={() => setChartView('expenses')}
              >
                Chi tiêu
              </button>
              <select className={styles.chartSelect} value={chartPeriod} onChange={(e) => setChartPeriod(e.target.value)}>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>
          </div>
          <div style={{ height: '250px', position: 'relative' }}>
            <SimpleChart data={chartData} activeView={chartView} />
          </div>
        </div>

        {/* Transactions Table */}
        <div className={styles.transactionsSection}>
          <div className={styles.transactionsHeader}>
            <div className={styles.transactionsTitle}>Giao dịch gần đây</div>
            <div className={styles.transactionsActions}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className={styles.searchInput}
              />
              <button className={styles.filterButton}>
                <span>⚙️</span>
                <span>Lọc</span>
              </button>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Deal ID</th>
                <th>Tên khách hàng</th>
                <th>Email khách hàng</th>
                <th>Ngày</th>
                <th>Số tiền</th>
                <th>Trạng thái giao dịch</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {transaction.customerName[0]}
                      </div>
                      <span>{transaction.customerName}</span>
                    </div>
                  </td>
                  <td>{transaction.email}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount} VNĐ</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        transaction.status === 'Success'
                          ? styles.statusSuccess
                          : styles.statusPending
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionButton}>⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// Simple Chart Component
function SimpleChart({ data, activeView }: { data: any[]; activeView: 'income' | 'expenses' }) {
  const maxValue = Math.max(
    ...data.map((d) => (activeView === 'income' ? d.income : d.expense))
  );
  const width = 800;
  const height = 200;
  const padding = 40;

  const points = data.slice(0, 12).map((d, i) => {
    const value = activeView === 'income' ? d.income : d.expense;
    return {
      x: padding + (i / 11) * (width - padding * 2),
      y: height - padding - ((value / maxValue) * (height - padding * 2)),
      value: value,
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
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Area */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="5"
          fill="url(#lineGradient)"
          style={{ cursor: 'pointer' }}
        >
          <title>
            {activeView === 'income' ? 'Thu nhập' : 'Chi tiêu'}: {p.value.toFixed(0)} VNĐ
          </title>
        </circle>
      ))}
    </svg>
  );
}
