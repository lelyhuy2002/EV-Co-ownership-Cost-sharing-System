"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import { useRouter } from "next/navigation";

interface MyGroup {
  id: string;
  name: string;
  myOwnershipPct: number;
  memberCount: number;
  description: string;
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  monthlyCost: number;
  vehicleType: string;
}

interface DiscoverGroup {
  id: string;
  name: string;
  description: string;
  availableOwnershipPct: number;
  memberCount: number;
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  category: string;
}

interface GroupToJoin {
  id: string;
  vehicleName: string;
  vehicleModel: string;
  currentMembers: number;
  maxMembers: number;
  ownershipAvailable: number;
  region: string;
  purpose: string;
  createdDate: string;
  adminName: string;
  status: "open" | "full";
  icon: string;
  color: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
}

const MY_GROUPS: MyGroup[] = [
  { 
    id: "grp-01", 
    name: "EV Shared Hanoi", 
    myOwnershipPct: 25, 
    memberCount: 4, 
    description: "Nhóm chia sẻ VF8 cho nhu cầu đi lại hằng ngày.",
    icon: "🚗",
    color: "blue",
    rating: 4.8,
    reviewCount: 24,
    monthlyCost: 450000,
    vehicleType: "VinFast VF8"
  },
  { 
    id: "grp-02", 
    name: "Model 3 Weekend", 
    myOwnershipPct: 10, 
    memberCount: 8, 
    description: "Cộng đồng sử dụng Tesla Model 3 cho cuối tuần.",
    icon: "⚡",
    color: "green",
    rating: 4.9,
    reviewCount: 36,
    monthlyCost: 400000,
    vehicleType: "Tesla Model 3"
  },
];

const DISCOVER_GROUPS: DiscoverGroup[] = [
  { 
    id: "grp-11", 
    name: "Charging Explorers", 
    description: "Nhóm test tuyến sạc đường dài.", 
    availableOwnershipPct: 15, 
    memberCount: 5,
    icon: "🔋",
    color: "orange",
    rating: 4.6,
    reviewCount: 18,
    category: "Research"
  },
  { 
    id: "grp-12", 
    name: "EcoDrive Study", 
    description: "Nghiên cứu thói quen lái xe đô thị.", 
    availableOwnershipPct: 30, 
    memberCount: 3,
    icon: "🌱",
    color: "green",
    rating: 4.7,
    reviewCount: 12,
    category: "Research"
  },
  { 
    id: "grp-13", 
    name: "V2G Pilot", 
    description: "Thí điểm giao dịch V2G khu vực HN.", 
    availableOwnershipPct: 20, 
    memberCount: 6,
    icon: "⚡",
    color: "purple",
    rating: 4.5,
    reviewCount: 15,
    category: "Pilot"
  },
];

const GROUPS_TO_JOIN: GroupToJoin[] = [
  {
    id: "grp-join-01",
    vehicleName: "Tesla Model 3",
    vehicleModel: "Standard Range Plus",
    currentMembers: 3,
    maxMembers: 5,
    ownershipAvailable: 40,
    region: "Hà Nội",
    purpose: "Đi lại hàng ngày",
    createdDate: "15/01/2025",
    adminName: "Nguyễn Văn A",
    status: "open",
    icon: "⚡",
    color: "blue",
    rating: 4.8,
    reviewCount: 32,
    priceRange: "2-3M VND"
  },
  {
    id: "grp-join-02", 
    vehicleName: "VinFast VF8",
    vehicleModel: "Eco",
    currentMembers: 2,
    maxMembers: 4,
    ownershipAvailable: 50,
    region: "TP.HCM",
    purpose: "Du lịch cuối tuần",
    createdDate: "20/01/2025",
    adminName: "Trần Thị B",
    status: "open",
    icon: "🚗",
    color: "green",
    rating: 4.6,
    reviewCount: 28,
    priceRange: "1.5-2.5M VND"
  },
  {
    id: "grp-join-03",
    vehicleName: "BYD Atto 3",
    vehicleModel: "Comfort",
    currentMembers: 4,
    maxMembers: 4,
    ownershipAvailable: 0,
    region: "Đà Nẵng", 
    purpose: "Công việc",
    createdDate: "10/01/2025",
    adminName: "Lê Văn C",
    status: "full",
    icon: "🔋",
    color: "orange",
    rating: 4.7,
    reviewCount: 19,
    priceRange: "1-2M VND"
  },
  {
    id: "grp-join-04",
    vehicleName: "Tesla Model Y",
    vehicleModel: "Long Range",
    currentMembers: 1,
    maxMembers: 6,
    ownershipAvailable: 83,
    region: "Hà Nội",
    purpose: "Gia đình",
    createdDate: "25/01/2025", 
    adminName: "Phạm Thị D",
    status: "open",
    icon: "⚡",
    color: "purple",
    rating: 4.9,
    reviewCount: 41,
    priceRange: "3-4M VND"
  }
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"mine" | "discover" | "find">("mine");
  const [query, setQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const router = useRouter();

  // AI Recommendations based on user behavior
  const aiRecommendations = [
    {
      id: "ai-rec-01",
      title: "Dựa trên lịch sử của bạn",
      groups: GROUPS_TO_JOIN.filter(g => g.region === "Hà Nội" && g.rating >= 4.5).slice(0, 2)
    },
    {
      id: "ai-rec-02", 
      title: "Xu hướng phổ biến",
      groups: GROUPS_TO_JOIN.filter(g => g.rating >= 4.7).slice(0, 2)
    }
  ];

  const handleNavClick = (index: number) => {
    // Map navigation indices to routes
    const routes = ["/home", "/groups", "/dashboard", "/provider", "/about", "/contact"];
    if (routes[index]) {
      router.push(routes[index]);
    }
  };

  const myGroups = useMemo(() => {
    return MY_GROUPS.filter(g => query ? (g.name + " " + g.description).toLowerCase().includes(query.toLowerCase()) : true);
  }, [query]);

  const discoverGroups = useMemo(() => {
    return DISCOVER_GROUPS.filter(g => query ? (g.name + " " + g.description).toLowerCase().includes(query.toLowerCase()) : true);
  }, [query]);

  const filteredGroupsToJoin = useMemo(() => {
    return GROUPS_TO_JOIN.filter(group => {
      const matchesSearch = searchQuery 
        ? (group.vehicleName + " " + group.vehicleModel + " " + group.region + " " + group.purpose)
            .toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesRegion = regionFilter ? group.region === regionFilter : true;
      const matchesVehicle = vehicleFilter ? group.vehicleName === vehicleFilter : true;
      const matchesStatus = statusFilter ? group.status === statusFilter : true;
      const matchesRating = group.rating >= ratingFilter;
      
      // Parse price range for filtering (simplified)
      const groupPrice = group.priceRange.includes("1-2M") ? 1500000 : 
                        group.priceRange.includes("2-3M") ? 2500000 : 
                        group.priceRange.includes("3-4M") ? 3500000 : 2000000;
      const matchesPrice = groupPrice >= priceRange[0] && groupPrice <= priceRange[1];
      
      return matchesSearch && matchesRegion && matchesVehicle && matchesStatus && matchesRating && matchesPrice;
    });
  }, [searchQuery, regionFilter, vehicleFilter, statusFilter, ratingFilter, priceRange]);

  return (
    <>
      <Header headerHidden={false} currentSection={1} goToSection={handleNavClick} />
      <main className={styles.container}>
      <div className={styles.actionsBar}>
        <input
          className={styles.inviteInput}
          placeholder="Nhập mã mời hoặc dán liên kết nhóm để tham gia"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button className={styles.secondaryBtn} onClick={() => {/* future: validate & join */}}>Tham gia</button>
        <button className={styles.primaryBtn} onClick={() => {/* future: create group flow */}}>Tạo nhóm mới</button>
        <div className={styles.helperText}>
          Dán liên kết mời từ bạn bè hoặc nhấn "Tạo nhóm mới" để bắt đầu. Người tạo sẽ trở thành Admin nhóm.
        </div>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Quản lý nhóm</h1>
            <p className={styles.subtitle}>Khám phá, tham gia và quản lý các nhóm đồng sở hữu xe điện một cách thông minh</p>
          </div>
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${activeTab === "mine" ? styles.tabActive : ""}`} onClick={() => setActiveTab("mine")}>
              <span>👥</span>
              <span>Nhóm của tôi</span>
            </button>
            <button className={`${styles.tabBtn} ${activeTab === "discover" ? styles.tabActive : ""}`} onClick={() => setActiveTab("discover")}>
              <span>🔍</span>
              <span>Khám phá nhóm</span>
            </button>
            <button className={`${styles.tabBtn} ${activeTab === "find" ? styles.tabActive : ""}`} onClick={() => setActiveTab("find")}>
              <span>➕</span>
              <span>Tìm & Tham gia</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Tìm kiếm nhóm..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {activeTab === "mine" ? (
        <section className={styles.enhancedGrid}>
          {myGroups.map((g) => (
            <article key={g.id} className={`${styles.enhancedCard} ${styles[g.color]}`}>
              <div className={styles.cardHeader}>
                <div className={styles.groupIcon}>{g.icon}</div>
                <div className={styles.groupInfo}>
                  <h3 className={styles.groupTitle}>{g.name}</h3>
                  <div className={styles.groupMeta}>
                    <span className={styles.memberCount}>{g.memberCount} thành viên</span>
                    <div className={styles.rating}>
                      <span className={styles.stars}>{"★".repeat(Math.floor(g.rating))}</span>
                      <span className={styles.ratingValue}>{g.rating}</span>
                      <span className={styles.reviewCount}>({g.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.vehicleInfo}>
                <span className={styles.vehicleType}>{g.vehicleType}</span>
                <span className={styles.monthlyCost}>{g.monthlyCost.toLocaleString()}đ/tháng</span>
              </div>
              
              <p className={styles.groupDesc}>{g.description}</p>
              
              <div className={styles.progress}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${g.myOwnershipPct}%` }} />
                </div>
                <div className={styles.progressText}>Tỷ lệ sở hữu của bạn: {g.myOwnershipPct}%</div>
              </div>
              
              <div className={styles.actionGroups}>
                <div className={styles.primaryActions}>
                  <Link href={`/groups/${g.id}/schedule`} className={`${styles.primaryBtn}`}>
                    <span>🗓️</span> <span>Đặt lịch & sử dụng xe</span>
                  </Link>
                  <Link href={`/groups/${g.id}/costs`} className={`${styles.primaryBtn}`}>
                    <span>💳</span> <span>Chi phí & thanh toán</span>
                  </Link>
                </div>
                <div className={styles.secondaryActions}>
                  <Link href={`/groups/${g.id}/history`} className={`${styles.secondaryBtn}`}>
                    <span>📈</span> <span>Lịch sử & phân tích</span>
                  </Link>
                  <Link href={`/groups/${g.id}/manage`} className={`${styles.secondaryBtn}`}>
                    <span>🛠️</span> <span>Quản lý nhóm</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : activeTab === "discover" ? (
        <section className={styles.enhancedGrid}>
          {discoverGroups.map((g) => (
            <article key={g.id} className={`${styles.enhancedCard} ${styles[g.color]}`}>
              <div className={styles.cardHeader}>
                <div className={styles.groupIcon}>{g.icon}</div>
                <div className={styles.groupInfo}>
                  <h3 className={styles.groupTitle}>{g.name}</h3>
                  <div className={styles.groupMeta}>
                    <span className={styles.memberCount}>{g.memberCount} thành viên</span>
                    <div className={styles.rating}>
                      <span className={styles.stars}>{"★".repeat(Math.floor(g.rating))}</span>
                      <span className={styles.ratingValue}>{g.rating}</span>
                      <span className={styles.reviewCount}>({g.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.categoryBadge}>
                <span className={styles.category}>{g.category}</span>
              </div>
              
              <p className={styles.groupDesc}>{g.description}</p>
              
              <div className={styles.progress}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFillAlt} style={{ width: `${g.availableOwnershipPct}%` }} />
                </div>
                <div className={styles.progressText}>Tỷ lệ sở hữu còn trống: {g.availableOwnershipPct}%</div>
              </div>
              
              <div className={styles.actionGroups}>
                <button className={styles.primaryBtn}>
                  <span>➕</span> <span>Yêu cầu tham gia</span>
                </button>
                <Link href={`/groups/${g.id}`} className={styles.secondaryBtn}>
                  <span>ℹ️</span> <span>Tìm hiểu thêm</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <div className={styles.enhancedSearchSection}>
            <div className={styles.searchHeader}>
              <h3>Tìm kiếm & Lọc nhóm</h3>
              <button 
                className={styles.aiToggle}
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              >
                <span>🤖</span>
                <span>AI Gợi ý</span>
              </button>
            </div>
            
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <input
                  className={styles.searchInput}
                  placeholder="Tìm kiếm theo tên xe, khu vực, mục đích sử dụng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>
              
              <div className={styles.filtersRow}>
                <select
                  className={styles.filterSelect}
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">Tất cả khu vực</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                
                <select
                  className={styles.filterSelect}
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                >
                  <option value="">Tất cả xe</option>
                  <option value="Tesla Model 3">Tesla Model 3</option>
                  <option value="Tesla Model Y">Tesla Model Y</option>
                  <option value="VinFast VF8">VinFast VF8</option>
                  <option value="BYD Atto 3">BYD Atto 3</option>
                </select>
                
                <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="open">Đang mở</option>
                  <option value="full">Đã đầy</option>
                </select>
                
                <select
                  className={styles.filterSelect}
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                >
                  <option value={0}>Tất cả đánh giá</option>
                  <option value={4}>4+ sao</option>
                  <option value={4.5}>4.5+ sao</option>
                  <option value={4.8}>4.8+ sao</option>
                </select>
              </div>
              
              <div className={styles.priceFilter}>
                <label>Khoảng giá: {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ</label>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="500000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className={styles.priceSlider}
                />
              </div>
            </div>
          </div>

          {showAIRecommendations && (
            <div className={styles.aiRecommendations}>
              <h3>🤖 AI Gợi ý cho bạn</h3>
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className={styles.aiSection}>
                  <h4>{rec.title}</h4>
                  <div className={styles.aiGrid}>
                    {rec.groups.map((group) => (
                      <div key={group.id} className={styles.aiCard}>
                        <div className={styles.aiCardHeader}>
                          <span className={styles.aiIcon}>{group.icon}</span>
                          <div>
                            <div className={styles.aiVehicleName}>{group.vehicleName}</div>
                            <div className={styles.aiRating}>
                              {"★".repeat(Math.floor(group.rating))} {group.rating}
                            </div>
                          </div>
                        </div>
                        <div className={styles.aiCardDetails}>
                          <div>📍 {group.region}</div>
                          <div>💰 {group.priceRange}</div>
                          <div>👥 {group.currentMembers}/{group.maxMembers} thành viên</div>
                        </div>
                        <button className={styles.aiJoinBtn}>Tham gia ngay</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className={styles.enhancedGroupsGrid}>
            {filteredGroupsToJoin.map(group => (
              <article key={group.id} className={`${styles.enhancedGroupCard} ${styles[group.color]}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.vehicleIcon}>{group.icon}</div>
                  <div className={styles.vehicleInfo}>
                    <div className={styles.vehicleName}>{group.vehicleName}</div>
                    <div className={styles.vehicleModel}>{group.vehicleModel}</div>
                    <div className={styles.rating}>
                      <span className={styles.stars}>{"★".repeat(Math.floor(group.rating))}</span>
                      <span className={styles.ratingValue}>{group.rating}</span>
                      <span className={styles.reviewCount}>({group.reviewCount})</span>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[`status${group.status.charAt(0).toUpperCase() + group.status.slice(1)}`]}`}>
                    {group.status === "open" ? "Đang mở" : "Đã đầy"}
                  </span>
                </div>

                <div className={styles.priceInfo}>
                  <span className={styles.priceRange}>{group.priceRange}</span>
                </div>

                <div className={styles.memberInfo}>
                  <div className={styles.memberCount}>
                    <div className={styles.number}>{group.currentMembers}</div>
                    <div className={styles.label}>Thành viên</div>
                  </div>
                  <div className={styles.memberCount}>
                    <div className={styles.number}>{group.maxMembers - group.currentMembers}</div>
                    <div className={styles.label}>Cần thêm</div>
                  </div>
                </div>

                <div className={styles.ownershipInfo}>
                  <div className={styles.ownershipBar}>
                    <div 
                      className={styles.ownershipFill}
                      style={{ width: `${group.ownershipAvailable}%` }}
                    />
                  </div>
                  <div className={styles.ownershipText}>
                    Tỷ lệ sở hữu còn lại: {group.ownershipAvailable}%
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
                    <span className={styles.detailValue}>{group.createdDate}</span>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.primaryActionBtn}
                    onClick={() => alert(`Đã gửi yêu cầu tham gia nhóm ${group.id}. Admin sẽ xem xét và phản hồi.`)}
                    disabled={group.status === "full"}
                  >
                    {group.status === "full" ? "Đã đầy" : "Gửi yêu cầu tham gia"}
                  </button>
                  <button
                    className={styles.secondaryActionBtn}
                    onClick={() => router.push(`/groups/${group.id}/details`)}
                  >
                    Chi tiết
                  </button>
                </div>
              </article>
            ))}
          </section>

          {filteredGroupsToJoin.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <p>Không tìm thấy nhóm nào phù hợp với tiêu chí tìm kiếm.</p>
              <p>Hãy thử điều chỉnh bộ lọc hoặc tạo nhóm mới.</p>
            </div>
          )}
        </>
      )}
      </main>
    </>
  );
}


