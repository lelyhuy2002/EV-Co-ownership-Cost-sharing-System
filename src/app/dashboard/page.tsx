"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";

// Dashboard Types
type DashboardType = "consumer" | "provider" | "coowner";

// Mock data for Data Consumer Dashboard
const consumerData = {
  totalPackages: 12,
  totalDownloads: 156,
  totalSpent: 2450000,
  recentAnalytics: [
    { label: "Hiệu suất pin (SoC)", value: "85%", trend: "+5%" },
    { label: "Quãng đường TB/ngày", value: "45km", trend: "+12%" },
    { label: "Tần suất sạc", value: "2.3 lần/ngày", trend: "-8%" },
    { label: "CO2 tiết kiệm", value: "1.2 tấn", trend: "+15%" }
  ],
  aiInsights: [
    "Xu hướng sử dụng xe tăng 15% vào cuối tuần",
    "Dự báo nhu cầu sạc cao nhất vào 8-9h sáng",
    "Gợi ý tối ưu lộ trình để tiết kiệm 20% năng lượng"
  ],
  recentPurchases: [
    { name: "Tesla Model 3 - Hà Nội", date: "15/01/2025", amount: 500000 },
    { name: "VinFast VF8 - TP.HCM", date: "10/01/2025", amount: 300000 },
    { name: "BYD Atto 3 - Đà Nẵng", date: "05/01/2025", amount: 250000 }
  ]
};

// Mock data for Data Provider Dashboard
const providerData = {
  totalRevenue: 12500000,
  totalDownloads: 1240,
  totalPackages: 8,
  monthlyRevenue: [
    { month: "Tháng 1", revenue: 3200000, downloads: 320 },
    { month: "Tháng 2", revenue: 2800000, downloads: 280 },
    { month: "Tháng 3", revenue: 3500000, downloads: 350 },
    { month: "Tháng 4", revenue: 3000000, downloads: 290 }
  ],
  packages: [
    { name: "Tesla Model 3 - Hà Nội", status: "active", downloads: 450, revenue: 4500000 },
    { name: "VinFast VF8 - TP.HCM", status: "pending", downloads: 0, revenue: 0 },
    { name: "BYD Atto 3 - Đà Nẵng", status: "active", downloads: 320, revenue: 3200000 }
  ]
};

// Mock data for Co-owner Dashboard
const coownerData = {
  totalGroups: 2,
  totalOwnership: 35,
  monthlyCost: 850000,
  usageHistory: [
    { date: "20/01/2025", distance: "45km", cost: 125000, vehicle: "Tesla Model 3" },
    { date: "19/01/2025", distance: "32km", cost: 89000, vehicle: "Tesla Model 3" },
    { date: "18/01/2025", distance: "67km", cost: 186000, vehicle: "VinFast VF8" }
  ],
  groupSummary: [
    { name: "EV Shared Hanoi", ownership: 25, monthlyCost: 450000, usage: "Hàng ngày" },
    { name: "Model 3 Weekend", ownership: 10, monthlyCost: 400000, usage: "Cuối tuần" }
  ]
};

export default function DashboardPage() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>("consumer");

  const handleNavClick = (index: number) => {
    // Handle navigation if needed
  };

  const renderDataConsumerDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.overview}>
        <h2>Tổng quan</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{consumerData.totalPackages}</div>
            <div className={styles.statLabel}>Gói dữ liệu đã mua</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{consumerData.totalDownloads}</div>
            <div className={styles.statLabel}>Lượt tải xuống</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{consumerData.totalSpent.toLocaleString()}đ</div>
            <div className={styles.statLabel}>Tổng chi phí</div>
          </div>
        </div>
      </div>

      <div className={styles.analytics}>
        <h2>Phân tích & Báo cáo</h2>
        <div className={styles.analyticsGrid}>
          {consumerData.recentAnalytics.map((item, index) => (
            <div key={index} className={styles.analyticsCard}>
              <div className={styles.analyticsLabel}>{item.label}</div>
              <div className={styles.analyticsValue}>{item.value}</div>
              <div className={styles.analyticsTrend}>{item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.aiInsights}>
        <h2>AI Gợi ý</h2>
        <div className={styles.insightsList}>
          {consumerData.aiInsights.map((insight, index) => (
            <div key={index} className={styles.insightItem}>
              <span className={styles.insightIcon}>🤖</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dataManagement}>
        <h2>Quản lý dữ liệu</h2>
        <div className={styles.purchasesList}>
          <h3>Lịch sử mua hàng gần đây</h3>
          {consumerData.recentPurchases.map((purchase, index) => (
            <div key={index} className={styles.purchaseItem}>
              <div className={styles.purchaseInfo}>
                <div className={styles.purchaseName}>{purchase.name}</div>
                <div className={styles.purchaseDate}>{purchase.date}</div>
              </div>
              <div className={styles.purchaseAmount}>{purchase.amount.toLocaleString()}đ</div>
            </div>
          ))}
        </div>
        <div className={styles.apiSection}>
          <h3>API Key Management</h3>
          <div className={styles.apiKey}>
            <span>API Key: ********************</span>
            <button className={styles.btnSecondary}>Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataProviderDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.overview}>
        <h2>Tổng quan</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{providerData.totalRevenue.toLocaleString()}đ</div>
            <div className={styles.statLabel}>Tổng doanh thu</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{providerData.totalDownloads}</div>
            <div className={styles.statLabel}>Lượt tải xuống</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{providerData.totalPackages}</div>
            <div className={styles.statLabel}>Gói dữ liệu</div>
          </div>
        </div>
      </div>

      <div className={styles.revenueReport}>
        <h2>Báo cáo tài chính</h2>
        <div className={styles.revenueChart}>
          {providerData.monthlyRevenue.map((month, index) => (
            <div key={index} className={styles.revenueItem}>
              <div className={styles.revenueMonth}>{month.month}</div>
              <div className={styles.revenueAmount}>{month.revenue.toLocaleString()}đ</div>
              <div className={styles.revenueDownloads}>{month.downloads} lượt tải</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dataManagement}>
        <h2>Quản lý dữ liệu</h2>
        <div className={styles.packagesList}>
          {providerData.packages.map((pkg, index) => (
            <div key={index} className={styles.packageItem}>
              <div className={styles.packageInfo}>
                <div className={styles.packageName}>{pkg.name}</div>
                <div className={`${styles.packageStatus} ${styles[pkg.status]}`}>
                  {pkg.status === "active" ? "Hoạt động" : "Chờ duyệt"}
                </div>
              </div>
              <div className={styles.packageStats}>
                <div>{pkg.downloads} lượt tải</div>
                <div>{pkg.revenue.toLocaleString()}đ</div>
              </div>
              <div className={styles.packageActions}>
                <button className={styles.btnSecondary}>Chỉnh sửa</button>
                <button className={styles.btnPrimary}>Tải lên mới</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.userAnalytics}>
        <h2>Phân tích người dùng</h2>
        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsLabel}>Người dùng tích cực</div>
            <div className={styles.analyticsValue}>156</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsLabel}>Tỷ lệ quay lại</div>
            <div className={styles.analyticsValue}>78%</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsLabel}>Đánh giá trung bình</div>
            <div className={styles.analyticsValue}>4.7/5</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoownerDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.overview}>
        <h2>Tổng quan</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{coownerData.totalGroups}</div>
            <div className={styles.statLabel}>Nhóm tham gia</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{coownerData.totalOwnership}%</div>
            <div className={styles.statLabel}>Tổng tỷ lệ sở hữu</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{coownerData.monthlyCost.toLocaleString()}đ</div>
            <div className={styles.statLabel}>Chi phí tháng này</div>
          </div>
        </div>
      </div>

      <div className={styles.usageHistory}>
        <h2>Lịch sử sử dụng</h2>
        <div className={styles.historyList}>
          {coownerData.usageHistory.map((usage, index) => (
            <div key={index} className={styles.historyItem}>
              <div className={styles.historyDate}>{usage.date}</div>
              <div className={styles.historyDetails}>
                <div className={styles.historyVehicle}>{usage.vehicle}</div>
                <div className={styles.historyDistance}>{usage.distance}</div>
              </div>
              <div className={styles.historyCost}>{usage.cost.toLocaleString()}đ</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.personalAnalysis}>
        <h2>Phân tích cá nhân</h2>
        <div className={styles.analysisGrid}>
          <div className={styles.analysisCard}>
            <div className={styles.analysisLabel}>Sử dụng vs Sở hữu</div>
            <div className={styles.analysisValue}>Cân bằng</div>
            <div className={styles.analysisNote}>Tỷ lệ sử dụng phù hợp với tỷ lệ sở hữu</div>
          </div>
          <div className={styles.analysisCard}>
            <div className={styles.analysisLabel}>Hiệu quả chi phí</div>
            <div className={styles.analysisValue}>Tốt</div>
            <div className={styles.analysisNote}>Tiết kiệm 15% so với thuê xe riêng</div>
          </div>
        </div>
      </div>

      <div className={styles.costSummary}>
        <h2>Tổng kết chi phí</h2>
        <div className={styles.costBreakdown}>
          {coownerData.groupSummary.map((group, index) => (
            <div key={index} className={styles.costItem}>
              <div className={styles.costGroupName}>{group.name}</div>
              <div className={styles.costDetails}>
                <div>Sở hữu: {group.ownership}%</div>
                <div>Chi phí: {group.monthlyCost.toLocaleString()}đ</div>
                <div>Sử dụng: {group.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contractsGroups}>
        <h2>Hợp đồng & Nhóm</h2>
        <div className={styles.contractsList}>
          <div className={styles.contractItem}>
            <div className={styles.contractName}>Hợp đồng EV Shared Hanoi</div>
            <div className={styles.contractStatus}>Hoạt động</div>
            <div className={styles.contractExpiry}>Hết hạn: 15/12/2025</div>
          </div>
          <div className={styles.contractItem}>
            <div className={styles.contractName}>Hợp đồng Model 3 Weekend</div>
            <div className={styles.contractStatus}>Hoạt động</div>
            <div className={styles.contractExpiry}>Hết hạn: 20/11/2025</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header headerHidden={false} currentSection={3} goToSection={handleNavClick} />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <div className={styles.dashboardTabs}>
            <button
              className={`${styles.tab} ${activeDashboard === "consumer" ? styles.active : ""}`}
              onClick={() => setActiveDashboard("consumer")}
            >
              <span>👤</span>
              <span>Người dùng dữ liệu</span>
            </button>
            <button
              className={`${styles.tab} ${activeDashboard === "provider" ? styles.active : ""}`}
              onClick={() => setActiveDashboard("provider")}
            >
              <span>🏢</span>
              <span>Nhà cung cấp</span>
            </button>
            <button
              className={`${styles.tab} ${activeDashboard === "coowner" ? styles.active : ""}`}
              onClick={() => setActiveDashboard("coowner")}
            >
              <span>🚗</span>
              <span>Đồng sở hữu</span>
            </button>
          </div>
        </div>

        {activeDashboard === "consumer" && renderDataConsumerDashboard()}
        {activeDashboard === "provider" && renderDataProviderDashboard()}
        {activeDashboard === "coowner" && renderCoownerDashboard()}
      </main>
    </>
  );
}
