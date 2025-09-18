"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { useRouter } from "next/navigation";
import { useUserGroups } from "@/hooks/useUserGroups";
import styles from "./page.module.css";

// Mock data for groups needing members
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
  members: { name: string; ownership: number }[];
  description: string;
  estimatedCost: number;
  monthlyCost: number;
}

const MOCK_GROUPS: Group[] = [
  {
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
      { name: "Nguyễn Văn A", ownership: 50 },
      { name: "Trần Thị B", ownership: 25 },
      { name: "Lê Văn C", ownership: 25 }
    ],
    description: "Nhóm đồng sở hữu VinFast VF8 cho nhu cầu đi lại hàng ngày và du lịch cuối tuần. Xe được bảo dưỡng định kỳ và có bảo hiểm đầy đủ.",
    estimatedCost: 850000000,
    monthlyCost: 2500000
  },
  {
    id: "fg-02",
    vehicleName: "Tesla Model 3",
    vehicleModel: "Standard Range Plus",
    region: "TP.HCM",
    purpose: "Công việc & kinh doanh",
    currentMembers: 2,
    neededMembers: 2,
    availableOwnershipPct: 50,
    status: "open",
    adminName: "Phạm Thị D",
    createdAt: "2024-01-20",
    members: [
      { name: "Phạm Thị D", ownership: 50 },
      { name: "Hoàng Văn E", ownership: 25 }
    ],
    description: "Tesla Model 3 cho mục đích công việc và kinh doanh. Phù hợp với những người cần xe sang trọng, tiết kiệm nhiên liệu.",
    estimatedCost: 1200000000,
    monthlyCost: 3500000
  },
  {
    id: "fg-03",
    vehicleName: "BYD Atto 3",
    vehicleModel: "Comfort",
    region: "Đà Nẵng",
    purpose: "Gia đình",
    currentMembers: 4,
    neededMembers: 0,
    availableOwnershipPct: 0,
    status: "full",
    adminName: "Lê Văn C",
    createdAt: "2024-01-10",
    members: [
      { name: "Lê Văn C", ownership: 40 },
      { name: "Nguyễn Thị F", ownership: 30 },
      { name: "Trần Văn G", ownership: 20 },
      { name: "Phạm Thị H", ownership: 10 }
    ],
    description: "BYD Atto 3 cho gia đình với không gian rộng rãi, phù hợp cho việc đưa đón con cái và du lịch gia đình.",
    estimatedCost: 750000000,
    monthlyCost: 2200000
  },
  {
    id: "fg-04",
    vehicleName: "Tesla Model Y",
    vehicleModel: "Long Range",
    region: "Hà Nội",
    purpose: "Du lịch & khám phá",
    currentMembers: 1,
    neededMembers: 3,
    availableOwnershipPct: 75,
    status: "open",
    adminName: "Vũ Thị I",
    createdAt: "2024-01-25",
    members: [
      { name: "Vũ Thị I", ownership: 25 }
    ],
    description: "Tesla Model Y Long Range với khả năng di chuyển xa, phù hợp cho những chuyến du lịch dài ngày và khám phá.",
    estimatedCost: 1500000000,
    monthlyCost: 4000000
  },
  {
    id: "fg-05",
    vehicleName: "VinFast VF 3",
    vehicleModel: "City",
    region: "TP.HCM",
    purpose: "Đi lại nội thành",
    currentMembers: 2,
    neededMembers: 2,
    availableOwnershipPct: 50,
    status: "open",
    adminName: "Đặng Văn K",
    createdAt: "2024-01-18",
    members: [
      { name: "Đặng Văn K", ownership: 50 },
      { name: "Bùi Thị L", ownership: 25 }
    ],
    description: "VinFast VF3 City Edition - xe điện nhỏ gọn, tiết kiệm, phù hợp cho việc di chuyển trong thành phố.",
    estimatedCost: 450000000,
    monthlyCost: 1500000
  }
];

export default function FindGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "full">("all");
  const [filterOwnership, setFilterOwnership] = useState("");
  const router = useRouter();
  const { user, joinGroup, createGroup } = useUserGroups();

  const handleNavClick = (index: number) => {
    const routes = ["/home", "/groups", "/find-groups", "/dashboard", "/provider", "/about", "/contact"];
    if (routes[index]) {
      router.push(routes[index]);
    }
  };

  const filteredGroups = useMemo(() => {
    return MOCK_GROUPS.filter(group => {
      const matchesSearch = searchQuery
        ? (group.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      const matchesRegion = filterRegion ? group.region === filterRegion : true;
      const matchesVehicleType = filterVehicleType ? group.vehicleName.includes(filterVehicleType) : true;
      const matchesStatus = filterStatus === "all" ? true : group.status === filterStatus;
      const matchesOwnership = filterOwnership ? 
        (filterOwnership === "low" ? group.availableOwnershipPct <= 25 :
         filterOwnership === "medium" ? group.availableOwnershipPct > 25 && group.availableOwnershipPct <= 50 :
         group.availableOwnershipPct > 50) : true;
      
      return matchesSearch && matchesRegion && matchesVehicleType && matchesStatus && matchesOwnership;
    });
  }, [searchQuery, filterRegion, filterVehicleType, filterStatus, filterOwnership]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Header headerHidden={false} currentSection={2} goToSection={handleNavClick} />
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Tìm & Tham gia nhóm đồng sở hữu</h1>
            <p className={styles.heroSubtitle}>
              Khám phá các nhóm đang cần thành viên và bắt đầu hành trình chia sẻ xe điện của bạn
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{MOCK_GROUPS.filter(g => g.status === "open").length}</div>
                <div className={styles.statLabel}>Nhóm đang mở</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{MOCK_GROUPS.reduce((sum, g) => sum + g.neededMembers, 0)}</div>
                <div className={styles.statLabel}>Vị trí còn trống</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>{MOCK_GROUPS.length}</div>
                <div className={styles.statLabel}>Tổng số nhóm</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchHeader}>
            <h2 className={styles.searchTitle}>Tìm nhóm phù hợp</h2>
            <p className={styles.searchSubtitle}>Sử dụng bộ lọc để tìm nhóm phù hợp với nhu cầu của bạn</p>
          </div>
          
          <div className={styles.searchForm}>
            <div className={styles.searchRow}>
              <input
                className={styles.searchInput}
                placeholder="Tìm kiếm theo tên xe, khu vực, mục đích sử dụng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.filterRow}>
              <select
                className={styles.filterSelect}
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="">Tất cả khu vực</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
              
              <select
                className={styles.filterSelect}
                value={filterVehicleType}
                onChange={(e) => setFilterVehicleType(e.target.value)}
              >
                <option value="">Tất cả loại xe</option>
                <option value="VinFast VF 8">VinFast VF 8</option>
                <option value="Tesla Model 3">Tesla Model 3</option>
                <option value="Tesla Model Y">Tesla Model Y</option>
                <option value="BYD Atto 3">BYD Atto 3</option>
                <option value="VinFast VF 3">VinFast VF 3</option>
              </select>
              
              <select
                className={styles.filterSelect}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "open" | "full")}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="full">Đã đầy</option>
              </select>
              
              <select
                className={styles.filterSelect}
                value={filterOwnership}
                onChange={(e) => setFilterOwnership(e.target.value)}
              >
                <option value="">Tất cả tỷ lệ sở hữu</option>
                <option value="low">Thấp (≤25%)</option>
                <option value="medium">Trung bình (26-50%)</option>
                <option value="high">Cao ({'>'}50%)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Groups Grid */}
        <section className={styles.groupsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Nhóm đang cần thành viên ({filteredGroups.length})
            </h2>
            <button 
              className={styles.createGroupBtn}
              onClick={async () => {
                const result = await createGroup({ name: 'Nhóm mới', vehicle: 'VinFast VF8' });
                if (result.success) {
                  alert('Đã tạo nhóm mới thành công! Bạn đã trở thành Admin của nhóm.');
                  router.push('/groups');
                } else {
                  alert('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại.');
                }
              }}
            >
              Tạo nhóm mới
            </button>
          </div>

          {filteredGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>Không tìm thấy nhóm nào</h3>
              <p className={styles.emptyDescription}>
                Không có nhóm nào phù hợp với tiêu chí tìm kiếm của bạn. 
                Hãy thử điều chỉnh bộ lọc hoặc tạo nhóm mới.
              </p>
              <button 
                className={styles.createGroupBtn}
                onClick={async () => {
                  const result = await createGroup({ name: 'Nhóm mới', vehicle: 'VinFast VF8' });
                  if (result.success) {
                    alert('Đã tạo nhóm mới thành công! Bạn đã trở thành Admin của nhóm.');
                    router.push('/groups');
                  } else {
                    alert('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại.');
                  }
                }}
              >
                Tạo nhóm mới
              </button>
            </div>
          ) : (
            <div className={styles.groupsGrid}>
              {filteredGroups.map(group => (
                <article key={group.id} className={styles.groupCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.vehicleInfo}>
                      <h3 className={styles.vehicleName}>{group.vehicleName}</h3>
                      <p className={styles.vehicleModel}>{group.vehicleModel}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[`status${group.status.charAt(0).toUpperCase() + group.status.slice(1)}`]}`}>
                      {group.status === "open" ? "Đang mở" : "Đã đầy"}
                    </span>
                  </div>

                  <div className={styles.cardContent}>
                    <p className={styles.description}>{group.description}</p>
                    
                    <div className={styles.memberInfo}>
                      <div className={styles.memberCount}>
                        <div className={styles.number}>{group.currentMembers}</div>
                        <div className={styles.label}>Thành viên hiện tại</div>
                      </div>
                      <div className={styles.memberCount}>
                        <div className={styles.number}>{group.neededMembers}</div>
                        <div className={styles.label}>Cần thêm</div>
                      </div>
                    </div>

                    <div className={styles.ownershipInfo}>
                      <div className={styles.ownershipBar}>
                        <div 
                          className={styles.ownershipFill}
                          style={{ width: `${100 - group.availableOwnershipPct}%` }}
                        />
                      </div>
                      <div className={styles.ownershipText}>
                        Tỷ lệ sở hữu còn lại: {group.availableOwnershipPct}%
                      </div>
                    </div>

                    <div className={styles.groupDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>📍 Khu vực:</span>
                        <span className={styles.detailValue}>{group.region}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>🎯 Mục đích:</span>
                        <span className={styles.detailValue}>{group.purpose}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>👤 Admin:</span>
                        <span className={styles.detailValue}>{group.adminName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>📅 Tạo ngày:</span>
                        <span className={styles.detailValue}>{new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className={styles.costInfo}>
                      <div className={styles.costRow}>
                        <span className={styles.costLabel}>Giá xe ước tính:</span>
                        <span className={styles.costValue}>{formatCurrency(group.estimatedCost)}</span>
                      </div>
                      <div className={styles.costRow}>
                        <span className={styles.costLabel}>Chi phí hàng tháng:</span>
                        <span className={styles.costValue}>{formatCurrency(group.monthlyCost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.joinBtn}
                      onClick={async () => {
                        const result = await joinGroup(group.id, `Tôi muốn tham gia nhóm ${group.vehicleName}`);
                        if (result.success) {
                          alert(`Đã gửi yêu cầu tham gia nhóm ${group.id}. Admin sẽ xem xét và phản hồi trong vòng 24h.`);
                        } else {
                          alert('Có lỗi xảy ra khi gửi yêu cầu tham gia. Vui lòng thử lại.');
                        }
                      }}
                      disabled={group.status === "full"}
                    >
                      {group.status === "full" ? "Đã đầy" : "Gửi yêu cầu tham gia"}
                    </button>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => router.push(`/find-groups/${group.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Không tìm thấy nhóm phù hợp?</h2>
            <p className={styles.ctaDescription}>
              Tạo nhóm mới và mời bạn bè tham gia, hoặc đăng ký nhận thông báo khi có nhóm mới phù hợp.
            </p>
            <div className={styles.ctaActions}>
              <button 
                className={styles.ctaPrimaryBtn}
                onClick={async () => {
                  const result = await createGroup({ name: 'Nhóm mới', vehicle: 'VinFast VF8' });
                  if (result.success) {
                    alert('Đã tạo nhóm mới thành công! Bạn đã trở thành Admin của nhóm.');
                    router.push('/groups');
                  } else {
                    alert('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại.');
                  }
                }}
              >
                Tạo nhóm mới
              </button>
              <button className={styles.ctaSecondaryBtn}>
                Đăng ký thông báo
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
