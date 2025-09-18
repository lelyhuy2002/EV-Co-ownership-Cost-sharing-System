"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface GroupMember {
  name: string;
  ownership: number;
  joinDate: string;
  avatar?: string;
  role: "admin" | "member";
}

interface Group {
  id: string;
  vehicleName: string;
  vehicleModel: string;
  region: string;
  purpose: string;
  currentMembers: number;
  neededMembers: number;
  availableOwnershipPct: number;
  status: "open" | "full";
  adminName: string;
  createdAt: string;
  members: GroupMember[];
  description: string;
  estimatedCost: number;
  monthlyCost: number;
  vehicleSpecs: {
    battery: string;
    range: string;
    charging: string;
    features: string[];
  };
  rules: string[];
  benefits: string[];
}

// Mock data - in real app, this would come from API
const MOCK_GROUP: Group = {
  id: "fg-01",
  vehicleName: "VinFast VF 8",
  vehicleModel: "Eco",
  region: "Hà Nội",
  purpose: "Đi lại hàng ngày & du lịch cuối tuần",
  currentMembers: 3,
  neededMembers: 1,
  availableOwnershipPct: 25,
  status: "open",
  adminName: "Nguyễn Văn A",
  createdAt: "2024-01-15",
  members: [
    { name: "Nguyễn Văn A", ownership: 50, joinDate: "2024-01-15", role: "admin" },
    { name: "Trần Thị B", ownership: 25, joinDate: "2024-01-20", role: "member" },
    { name: "Lê Văn C", ownership: 25, joinDate: "2024-01-25", role: "member" }
  ],
  description: "Nhóm đồng sở hữu VinFast VF8 cho nhu cầu đi lại hàng ngày và du lịch cuối tuần. Xe được bảo dưỡng định kỳ và có bảo hiểm đầy đủ. Chúng tôi tìm kiếm thành viên thứ 4 để hoàn thiện nhóm và bắt đầu hành trình chia sẻ xe điện.",
  estimatedCost: 850000000,
  monthlyCost: 2500000,
  vehicleSpecs: {
    battery: "87.7 kWh",
    range: "471 km (WLTP)",
    charging: "DC Fast Charge 150kW",
    features: ["ADAS", "OTA Updates", "Panoramic Sunroof", "Wireless Charging"]
  },
  rules: [
    "Đặt lịch sử dụng xe trước ít nhất 24h",
    "Không hút thuốc trong xe",
    "Báo cáo sự cố ngay khi phát hiện",
    "Đổ xăng/điện đầy trước khi trả xe",
    "Không sử dụng xe cho mục đích thương mại"
  ],
  benefits: [
    "Tiết kiệm chi phí sở hữu xe",
    "Chia sẻ trách nhiệm bảo dưỡng",
    "Linh hoạt trong việc sử dụng",
    "Kết nối với cộng đồng EV",
    "Hỗ trợ bảo hiểm toàn diện"
  ]
};

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const router = useRouter();

  const handleNavClick = (index: number) => {
    const routes = ["/home", "/groups", "/find-groups", "/dashboard", "/provider", "/about", "/contact"];
    if (routes[index]) {
      router.push(routes[index]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleJoinRequest = () => {
    if (joinMessage.trim()) {
      alert(`Đã gửi yêu cầu tham gia nhóm với lời nhắn: "${joinMessage}". Admin sẽ xem xét và phản hồi trong vòng 24h.`);
      setShowJoinForm(false);
      setJoinMessage("");
    } else {
      alert("Vui lòng nhập lời nhắn cho Admin nhóm.");
    }
  };

  return (
    <>
      <Header headerHidden={false} currentSection={2} goToSection={handleNavClick} />
      <main className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/find-groups" className={styles.breadcrumbLink}>
            Tìm & Tham gia nhóm
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{MOCK_GROUP.vehicleName}</span>
        </nav>

        {/* Group Header */}
        <section className={styles.groupHeader}>
          <div className={styles.vehicleInfo}>
            <h1 className={styles.vehicleName}>{MOCK_GROUP.vehicleName}</h1>
            <p className={styles.vehicleModel}>{MOCK_GROUP.vehicleModel}</p>
            <div className={styles.groupMeta}>
              <span className={styles.region}>📍 {MOCK_GROUP.region}</span>
              <span className={styles.purpose}>🎯 {MOCK_GROUP.purpose}</span>
            </div>
          </div>
          <div className={styles.groupStatus}>
            <span className={`${styles.statusBadge} ${styles[`status${MOCK_GROUP.status.charAt(0).toUpperCase() + MOCK_GROUP.status.slice(1)}`]}`}>
              {MOCK_GROUP.status === "open" ? "Đang mở" : "Đã đầy"}
            </span>
            <div className={styles.memberCount}>
              {MOCK_GROUP.currentMembers} / {MOCK_GROUP.currentMembers + MOCK_GROUP.neededMembers} thành viên
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.contentLeft}>
            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Mô tả nhóm</h2>
              <p className={styles.description}>{MOCK_GROUP.description}</p>
            </section>

            {/* Vehicle Specifications */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Thông số kỹ thuật xe</h2>
              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Pin</div>
                  <div className={styles.specValue}>{MOCK_GROUP.vehicleSpecs.battery}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Tầm hoạt động</div>
                  <div className={styles.specValue}>{MOCK_GROUP.vehicleSpecs.range}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Sạc nhanh</div>
                  <div className={styles.specValue}>{MOCK_GROUP.vehicleSpecs.charging}</div>
                </div>
              </div>
              <div className={styles.features}>
                <h3 className={styles.featuresTitle}>Tính năng nổi bật</h3>
                <div className={styles.featuresList}>
                  {MOCK_GROUP.vehicleSpecs.features.map((feature, index) => (
                    <span key={index} className={styles.featureTag}>{feature}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Group Rules */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Quy định nhóm</h2>
              <ul className={styles.rulesList}>
                {MOCK_GROUP.rules.map((rule, index) => (
                  <li key={index} className={styles.ruleItem}>{rule}</li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Lợi ích tham gia</h2>
              <ul className={styles.benefitsList}>
                {MOCK_GROUP.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>{benefit}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className={styles.contentRight}>
            {/* Join Request Card */}
            <div className={styles.joinCard}>
              <h3 className={styles.joinTitle}>Tham gia nhóm</h3>
              <div className={styles.ownershipInfo}>
                <div className={styles.ownershipBar}>
                  <div 
                    className={styles.ownershipFill}
                    style={{ width: `${100 - MOCK_GROUP.availableOwnershipPct}%` }}
                  />
                </div>
                <div className={styles.ownershipText}>
                  Tỷ lệ sở hữu còn lại: {MOCK_GROUP.availableOwnershipPct}%
                </div>
              </div>
              
              <div className={styles.costInfo}>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>Giá xe ước tính:</span>
                  <span className={styles.costValue}>{formatCurrency(MOCK_GROUP.estimatedCost)}</span>
                </div>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>Chi phí hàng tháng:</span>
                  <span className={styles.costValue}>{formatCurrency(MOCK_GROUP.monthlyCost)}</span>
                </div>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>Chi phí sở hữu ({MOCK_GROUP.availableOwnershipPct}%):</span>
                  <span className={styles.costValue}>{formatCurrency(MOCK_GROUP.estimatedCost * MOCK_GROUP.availableOwnershipPct / 100)}</span>
                </div>
              </div>

              {!showJoinForm ? (
                <button
                  className={styles.joinBtn}
                  onClick={() => setShowJoinForm(true)}
                  disabled={MOCK_GROUP.status === "full"}
                >
                  {MOCK_GROUP.status === "full" ? "Nhóm đã đầy" : "Gửi yêu cầu tham gia"}
                </button>
              ) : (
                <div className={styles.joinForm}>
                  <textarea
                    className={styles.joinMessage}
                    placeholder="Nhập lời nhắn cho Admin nhóm (tùy chọn)..."
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    rows={4}
                  />
                  <div className={styles.joinFormActions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowJoinForm(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className={styles.submitBtn}
                      onClick={handleJoinRequest}
                    >
                      Gửi yêu cầu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Members */}
            <div className={styles.membersCard}>
              <h3 className={styles.membersTitle}>Thành viên hiện tại</h3>
              <div className={styles.membersList}>
                {MOCK_GROUP.members.map((member, index) => (
                  <div key={index} className={styles.memberItem}>
                    <div className={styles.memberAvatar}>
                      {member.name.charAt(0)}
                    </div>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberName}>
                        {member.name}
                        {member.role === "admin" && <span className={styles.adminBadge}>Admin</span>}
                      </div>
                      <div className={styles.memberOwnership}>{member.ownership}% sở hữu</div>
                      <div className={styles.memberJoinDate}>
                        Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Info */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Thông tin nhóm</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Admin:</span>
                  <span className={styles.infoValue}>{MOCK_GROUP.adminName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tạo ngày:</span>
                  <span className={styles.infoValue}>{new Date(MOCK_GROUP.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Trạng thái:</span>
                  <span className={styles.infoValue}>
                    {MOCK_GROUP.status === "open" ? "Đang tìm thành viên" : "Đã đầy"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
