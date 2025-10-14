"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import { mockApi } from '@/lib/mockApi';
import { GROUPS_TO_JOIN, MY_GROUPS, type GroupToJoin, type MyGroup } from '@/lib/groupsData';
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { useUserGroups } from "@/hooks/useUserGroups";
import { 
  Users, Search, FileText, MapPin, Target, User, Calendar, 
  CalendarDays, CreditCard, TrendingUp, Settings, X, Clock, 
  CheckCircle2, XCircle, AlertTriangle, DollarSign, Star, 
  Square, CheckCircle, Sparkles 
} from "lucide-react";

// Group List Item Component for List View
function GroupListItem({ group, onJoin, onViewDetails, isRequested }: { 
  group: GroupToJoin; 
  onJoin: (id: string) => void; 
  onViewDetails: (id: string) => void; 
  isRequested?: boolean;
}) {
  return (
    <article className={`${styles.listItem} ${styles[group.color]}`}>
      {/* Status Badge - Moved to top for better visibility */}
      <div className={styles.statusBadgeContainer}>
        <span className={`${styles.statusBadge} ${styles[`status${group.status.charAt(0).toUpperCase() + group.status.slice(1)}`]}`}>
          {group.status === "open" ? (
            <><CheckCircle size={14} style={{display: 'inline', marginRight: '4px'}} /> Còn trống</>
          ) : (
            <><XCircle size={14} style={{display: 'inline', marginRight: '4px'}} /> Đã đầy</>
          )}
        </span>
      </div>

      <div className={styles.listItemHeader}>
        <div className={styles.vehicleIcon}>{group.icon}</div>
        <div className={styles.vehicleInfo}>
          <h3 className={styles.vehicleName}>{group.vehicleName}</h3>
          <p className={styles.vehicleModel}>{group.vehicleModel}</p>
          <div className={styles.rating}>
            <span className={styles.stars}>{"★".repeat(Math.floor(group.rating))}</span>
            <span className={styles.ratingValue}>{group.rating}</span>
            <span className={styles.reviewCount}>({group.reviewCount})</span>
          </div>
        </div>
        <div className={styles.priceSection}>
          <div className={styles.priceRange}>{group.priceRange}</div>
        </div>
      </div>

      <div className={styles.listItemContent}>
        <div className={styles.memberStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{group.currentMembers}</span>
            <span className={styles.statLabel}>Thành viên</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{group.maxMembers - group.currentMembers}</span>
            <span className={styles.statLabel}>Cần thêm</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{group.ownershipAvailable}%</span>
            <span className={styles.statLabel}>Sở hữu còn lại</span>
          </div>
        </div>

        <div className={styles.groupMeta}>
          <div className={styles.metaItem}>
            <MapPin size={16} className={styles.metaIcon} />
            <span>{group.region}</span>
          </div>
          <div className={styles.metaItem}>
            <Target size={16} className={styles.metaIcon} />
            <span>{group.purpose}</span>
          </div>
          <div className={styles.metaItemCompact}>
            <User size={14} className={styles.metaIcon} />
            <span className={styles.adminNameCompact}>{group.adminName}</span>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={16} className={styles.metaIcon} />
            <span>{group.createdDate}</span>
          </div>
        </div>
      </div>

      <div className={styles.listItemActions}>
        <button
          className={styles.primaryActionBtn}
          onClick={() => onJoin(group.id)}
          disabled={group.status === "full" || isRequested}
        >
          {group.status === "full" ? "Đã đầy" : isRequested ? "Đã gửi yêu cầu" : "Tham gia ngay"}
        </button>
        <button
          className={styles.secondaryActionBtn}
          onClick={() => onViewDetails(group.id)}
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}

// GroupCard component removed - using list view only for better UX

// types moved to lib/groupsData

// DiscoverGroup interface removed - consolidated functionality

// types moved to lib/groupsData

// data moved to lib/groupsData

// DISCOVER_GROUPS removed - consolidated into GROUPS_TO_JOIN for better UX

// data moved to lib/groupsData

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"mine" | "discover" | "requests">("mine");
  const [query, setQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFullGroups, setShowFullGroups] = useState(false);
  const router = useRouter();
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const { user } = useUserGroups();
  
  // Form states for modal
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [minOwnershipPercentage, setMinOwnershipPercentage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-hide error/success messages after 3 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => {
        setFormError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  // Poll my join requests to fill Requests tab
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) { setMyRequests([]); return; }
        const user = JSON.parse(raw);
        const reqs = await mockApi.getJoinRequests();
        if (!alive) return;
        setMyRequests(reqs.filter((r:any)=> r.userId === user.id).sort((a:any,b:any)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()));
      } catch {}
    }
    load();
    const t = setInterval(load, 2000);
    return () => { alive = false; clearInterval(t); };
  }, []);

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
    const routes = ["/home", "/groups", "/dashboard", "/about", "/contact"];
    if (routes[index]) {
      router.push(routes[index]);
    }
  };

  const myGroups = useMemo(() => {
    return MY_GROUPS.filter(g => query ? (g.name + " " + g.description).toLowerCase().includes(query.toLowerCase()) : true);
  }, [query]);

  // Removed discoverGroups as it's no longer used after consolidation

  const filteredGroupsToJoin = useMemo(() => {
    return GROUPS_TO_JOIN.filter(group => {
      const matchesSearch = searchQuery 
        ? (group.vehicleName + " " + group.vehicleModel + " " + group.region + " " + group.purpose)
            .toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesRegion = regionFilter ? group.region === regionFilter : true;
      const matchesVehicle = vehicleFilter ? group.vehicleName === vehicleFilter : true;
      
      // Parse price range for filtering (simplified)
      const groupPrice = group.priceRange.includes("1-2M") ? 1500000 : 
                        group.priceRange.includes("2-3M") ? 2500000 : 
                        group.priceRange.includes("3-4M") ? 3500000 : 2000000;
      const matchesPrice = groupPrice >= priceRange[0] && groupPrice <= priceRange[1];
      
      return matchesSearch && matchesRegion && matchesVehicle && matchesPrice;
    });
  }, [searchQuery, regionFilter, vehicleFilter, priceRange]);

  // Separate open and full groups
  const { openGroups, fullGroups } = useMemo(() => {
    const open = filteredGroupsToJoin.filter(group => group.status === "open");
    const full = filteredGroupsToJoin.filter(group => group.status === "full");
    
    // Sort groups based on selected criteria
    const sortGroups = (groups: typeof GROUPS_TO_JOIN) => {
      return [...groups].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdDate.split('/').reverse().join('-')).getTime() - 
                   new Date(a.createdDate.split('/').reverse().join('-')).getTime();
          case "rating":
            return b.rating - a.rating;
          case "members":
            return b.currentMembers - a.currentMembers;
          case "price":
            const priceA = a.priceRange.includes("1-2M") ? 1500000 : 
                          a.priceRange.includes("2-3M") ? 2500000 : 
                          a.priceRange.includes("3-4M") ? 3500000 : 2000000;
            const priceB = b.priceRange.includes("1-2M") ? 1500000 : 
                          b.priceRange.includes("2-3M") ? 2500000 : 
                          b.priceRange.includes("3-4M") ? 3500000 : 2000000;
            return priceA - priceB;
          default:
            return 0;
        }
      });
    };
    
    return {
      openGroups: sortGroups(open),
      fullGroups: sortGroups(full)
    };
  }, [filteredGroupsToJoin, sortBy]);

  // Event handlers
  const handleJoinGroup = async (groupId: string) => {
    // read current user from localStorage (mock)
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      alert('Vui lòng đăng ký/đăng nhập trước khi tham gia nhóm (demo)');
      return;
    }
    const user = JSON.parse(raw);
    try {
      await mockApi.requestJoin(groupId, user.id, user.fullName || user.username, 'Xin tham gia (demo)');
      alert(`Đã gửi yêu cầu tham gia nhóm ${groupId}. Admin sẽ xem xét và phản hồi.`);
    } catch (err) {
      console.error(err);
      alert('Không thể gửi yêu cầu, thử lại sau');
    }
  };

  const handleViewDetails = (groupId: string) => {
    // For vehicle details, route to /vehicles/[id]
    router.push(`/vehicles/${groupId}`);
  };

  return (
    <>
      <Header />
      
      {/* Success Message */}
      {successMessage && (
        <div className={styles.successAlert}>
          <CheckCircle2 size={18} style={{display: 'inline', marginRight: '8px'}} /> {successMessage}
        </div>
      )}

      <main className={styles.container}>
      <div className={styles.actionsBar}>
        <input
          className={styles.inviteInput}
          placeholder="Nhập mã mời hoặc dán liên kết nhóm để tham gia"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button className={styles.secondaryBtn} onClick={() => {/* future: validate & join */}}>Tham gia</button>
        <button className={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>Tạo nhóm mới</button>
        <div className={styles.helperText}>
          Dán liên kết mời từ bạn bè hoặc nhấn &quot;Tạo nhóm mới&quot; để bắt đầu. Người tạo sẽ trở thành Admin nhóm.
        </div>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Quản lý nhóm</h1>
            <p className={styles.subtitle}>Kết nối cộng đồng người dùng xe điện thông minh</p>
          </div>
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${activeTab === "mine" ? styles.tabActive : ""}`} onClick={() => setActiveTab("mine")}>
              <Users size={20} />
              <span>Nhóm của tôi</span>
            </button>
            <button className={`${styles.tabBtn} ${activeTab === "discover" ? styles.tabActive : ""}`} onClick={() => setActiveTab("discover")}>
              <Search size={20} />
              <span>Khám phá nhóm</span>
            </button>
            <button className={`${styles.tabBtn} ${activeTab === "requests" ? styles.tabActive : ""}`} onClick={() => setActiveTab("requests")}>
              <FileText size={20} />
              <span>Yêu cầu tham gia</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search size={22} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Tìm kiếm nhóm..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
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
                    <CalendarDays size={18} style={{display: 'inline', marginRight: '8px'}} /> <span>Đặt lịch & sử dụng xe</span>
                  </Link>
                  <Link href={`/groups/${g.id}/costs`} className={`${styles.primaryBtn}`}>
                    <CreditCard size={18} style={{display: 'inline', marginRight: '8px'}} /> <span>Chi phí & thanh toán</span>
                  </Link>
                </div>
                <div className={styles.secondaryActions}>
                  <Link href={`/groups/${g.id}/history`} className={`${styles.secondaryBtn}`}>
                    <TrendingUp size={18} style={{display: 'inline', marginRight: '8px'}} /> <span>Lịch sử & phân tích</span>
                  </Link>
                  <Link href={`/groups/${g.id}/manage`} className={`${styles.secondaryBtn}`}>
                    <Settings size={18} style={{display: 'inline', marginRight: '8px'}} /> <span>Quản lý nhóm</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : activeTab === "discover" ? (
        <div className={styles.discoverContainer}>
          {/* Compact Header */}
          <div className={styles.discoverHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.discoverTitle}>Tìm & Tham gia nhóm</h1>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{GROUPS_TO_JOIN.filter(g => g.status === "open").length}</span>
                  <span className={styles.statLabel}>Nhóm mở</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{GROUPS_TO_JOIN.reduce((sum, g) => sum + (g.maxMembers - g.currentMembers), 0)}</span>
                  <span className={styles.statLabel}>Vị trí trống</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{GROUPS_TO_JOIN.length}</span>
                  <span className={styles.statLabel}>Tổng nhóm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Search & Filter Section */}
          <div className={styles.searchFilterSection}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <input
                  className={styles.searchInput}
                  placeholder="Tìm kiếm nhóm theo tên xe, khu vực..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={20} className={styles.searchIcon} />
              </div>
              <button 
                className={styles.aiToggle}
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              >
                <Sparkles size={18} />
                <span>AI Gợi ý</span>
              </button>
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
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              >
                <option value={5000000}>Tất cả giá</option>
                <option value={1000000}>Dưới 1M</option>
                <option value={2000000}>1-2M</option>
                <option value={3000000}>2-3M</option>
                <option value={4000000}>3-4M</option>
                <option value={5000000}>Trên 4M</option>
              </select>

              <div className={styles.sortGroup}>
                <label>Sắp xếp:</label>
                <select 
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="members">Số thành viên</option>
                  <option value="price">Giá tham gia</option>
                </select>
              </div>

              <button 
                className={`${styles.filterBtn} ${showFullGroups ? styles.active : ''}`}
                onClick={() => setShowFullGroups(!showFullGroups)}
              >
                {showFullGroups ? <CheckCircle2 size={16} style={{display: 'inline', marginRight: '4px'}} /> : <Square size={16} style={{display: 'inline', marginRight: '4px'}} />} Nhóm đầy
              </button>
            </div>
          </div>

        {/* AI Recommendations - Simplified */}
        {showAIRecommendations && (
          <div className={styles.aiSection}>
            <h3><Sparkles size={20} style={{display: 'inline', marginRight: '8px'}} /> Gợi ý cho bạn</h3>
            <div className={styles.aiCards}>
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className={styles.aiCard}>
                  <h4>{rec.title}</h4>
                  <div className={styles.aiGroupList}>
                    {rec.groups.map((group) => (
                      <div key={group.id} className={styles.aiGroupItem}>
                        <span className={styles.aiIcon}>{group.icon}</span>
                        <div className={styles.aiInfo}>
                          <div className={styles.aiVehicleName}>{group.vehicleName}</div>
                          <div className={styles.aiMeta}><MapPin size={14} style={{display: 'inline', marginRight: '4px'}} /> {group.region} • <DollarSign size={14} style={{display: 'inline', marginRight: '4px'}} /> {group.priceRange} • <Star size={14} style={{display: 'inline', marginRight: '4px'}} /> {group.rating}</div>
                        </div>
                        <button className={styles.aiJoinBtn} onClick={() => handleJoinGroup(group.id)}>Tham gia</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Section - Always show two categories */}
        <div className={styles.groupsSection}>
          {openGroups.length > 0 && (
            <div className={styles.groupCategory}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <CheckCircle size={18} style={{display: 'inline', marginRight: '8px', color: '#10b981'}} /> Nhóm đang cần thành viên ({openGroups.length})
                </h3>
              </div>
              <div className={styles.groupsList}>
                {openGroups.map((group) => (
                  <GroupListItem key={group.id} group={group} onJoin={handleJoinGroup} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}

          {showFullGroups && fullGroups.length > 0 && (
            <div className={styles.groupCategory}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <XCircle size={18} style={{display: 'inline', marginRight: '8px', color: '#ef4444'}} /> Nhóm đã đầy ({fullGroups.length})
                </h3>
              </div>
              <div className={styles.groupsList}>
                {fullGroups.map((group) => (
                  <GroupListItem key={group.id} group={group} onJoin={handleJoinGroup} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredGroupsToJoin.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Search size={48} /></div>
            <h3>Không tìm thấy nhóm phù hợp</h3>
            <p>Hãy thử điều chỉnh bộ lọc hoặc tạo nhóm mới.</p>
            <button className={styles.createGroupBtn} onClick={() => alert('Chức năng tạo nhóm sẽ được triển khai sớm!')}>
              Tạo nhóm mới
            </button>
          </div>
        )}
      </div>
    ) : (
        /* Tab "Yêu cầu tham gia" */
        <section className={styles.requestsSection}>
          <div className={styles.requestsHeader}>
            <h2>Yêu cầu tham gia của bạn</h2>
            <p>Theo dõi trạng thái các yêu cầu tham gia nhóm mà bạn đã gửi</p>
          </div>

          <div className={styles.requestsGrid}>
            {myRequests.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><FileText size={48} /></div>
                <h3>Chưa có yêu cầu nào</h3>
                <p>Hãy duyệt các nhóm và gửi yêu cầu tham gia.</p>
                <button className={styles.primaryBtn} onClick={() => setActiveTab("discover")}>Khám phá nhóm</button>
              </div>
            ) : (
              myRequests.map((r:any) => (
                <article key={r.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <div className={styles.groupIcon}><Users size={24} /></div>
                    <div className={styles.requestInfo}>
                      <h3>Yêu cầu vào nhóm {r.groupId}</h3>
                      <div className={styles.requestMeta}>
                        <span className={`${styles.status} ${r.status === 'pending' ? '' : r.status === 'approved' ? styles.approved : styles.rejected}`}>
                          {r.status === 'pending' ? (
                            <><Clock size={14} style={{display: 'inline', marginRight: '4px'}} /> Đang chờ duyệt</>
                          ) : r.status === 'approved' ? (
                            <><CheckCircle2 size={14} style={{display: 'inline', marginRight: '4px'}} /> Đã chấp nhận</>
                          ) : (
                            <><XCircle size={14} style={{display: 'inline', marginRight: '4px'}} /> Từ chối</>
                          )}
                        </span>
                        <span className={styles.date}>Gửi: {new Date(r.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  {r.message && (
                    <div className={styles.requestDetails}>
                      <div className={styles.detailRow}>
                        <span>Lời nhắn:</span>
                        <span>{r.message}</span>
                      </div>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {false && ( /* Show when no requests */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><FileText size={48} /></div>
              <h3>Chưa có yêu cầu tham gia nào</h3>
              <p>Hãy khám phá các nhóm có sẵn và gửi yêu cầu tham gia để bắt đầu hành trình chia sẻ xe điện.</p>
              <button className={styles.primaryBtn} onClick={() => setActiveTab("discover")}>
                Khám phá nhóm
              </button>
            </div>
          )}
        </section>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => {
          setShowCreateModal(false);
          setModalStep(1);
          setGroupName("");
          setDescription("");
          setVehicleId("");
          setEstimatedValue("");
          setMaxMembers("");
          setMinOwnershipPercentage("");
          setFormError(null);
        }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Tạo nhóm mới</h2>
              <button 
                className={styles.modalClose}
                onClick={() => {
                  setShowCreateModal(false);
                  setModalStep(1);
                  setGroupName("");
                  setDescription("");
                  setVehicleId("");
                  setEstimatedValue("");
                  setMaxMembers("");
                  setMinOwnershipPercentage("");
                  setFormError(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className={styles.modalProgress}>
              <div className={styles.progressSteps} data-step={modalStep}>
                <div className={`${styles.progressStep} ${modalStep === 1 ? styles.active : ''} ${modalStep > 1 ? styles.completed : ''}`}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepLabel}>Thông tin</div>
                </div>
                <div className={`${styles.progressStep} ${modalStep === 2 ? styles.active : ''} ${modalStep > 2 ? styles.completed : ''}`}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepLabel}>Chi tiết xe</div>
                </div>
                <div className={`${styles.progressStep} ${modalStep === 3 ? styles.active : ''}`}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepLabel}>Xác nhận</div>
                </div>
              </div>
            </div>

            {formError && (
              <div className={styles.errorAlert}>
                <AlertTriangle size={18} style={{display: 'inline', marginRight: '8px'}} /> {formError}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {modalStep === 1 && (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên nhóm <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="VD: EV Shared Hanoi"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Mô tả <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Mô tả ngắn về nhóm của bạn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => {
                      setShowCreateModal(false);
                      setModalStep(1);
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => {
                      if (!groupName || !description) {
                        setFormError("Vui lòng điền đầy đủ thông tin");
                        return;
                      }
                      setFormError(null);
                      setModalStep(2);
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {modalStep === 2 && (
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    ID Xe <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Nhập ID xe của bạn"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                  />
                  <small className={styles.formHint}>
                    ID xe từ hệ thống quản lý xe của bạn
                  </small>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Giá trị ước tính (VND) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="VD: 800000000"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                  />
                  <small className={styles.formHint}>
                    Giá trị hiện tại của xe điện
                  </small>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Số thành viên tối đa <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="VD: 5"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                  />
                  <small className={styles.formHint}>
                    Từ 2 đến 10 thành viên
                  </small>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tỷ lệ sở hữu tối thiểu (%) <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.percentageInputContainer}>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="VD: 10"
                      value={minOwnershipPercentage}
                      onChange={(e) => setMinOwnershipPercentage(e.target.value)}
                    />
                    <div className={styles.percentageCircle}>
                      <svg className={styles.circularProgress} width="60" height="60">
                        <circle
                          className={styles.progressTrack}
                          cx="30"
                          cy="30"
                          r="25"
                          fill="transparent"
                          stroke="#e5e7eb"
                          strokeWidth="4"
                        />
                        <circle
                          className={styles.progressBar}
                          cx="30"
                          cy="30"
                          r="25"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(parseFloat(minOwnershipPercentage) || 0) * 1.57} 157`}
                          transform="rotate(-90 30 30)"
                        />
                      </svg>
                      <div className={styles.percentageText}>
                        {minOwnershipPercentage || 0}%
                      </div>
                    </div>
                  </div>
                  <small className={styles.formHint}>
                    Tỷ lệ sở hữu tối thiểu để tham gia nhóm (5-50%)
                  </small>
                </div>
                <div className={styles.modalActions}>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setModalStep(1)}
                  >
                    Quay lại
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => {
                      if (!vehicleId || !estimatedValue || !maxMembers || !minOwnershipPercentage) {
                        setFormError("Vui lòng điền đầy đủ thông tin xe và cài đặt nhóm");
                        return;
                      }
                      setFormError(null);
                      setModalStep(3);
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {modalStep === 3 && (
              <div className={styles.modalBody}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Thông tin nhóm</h3>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Tên nhóm:</span>
                      <span className={styles.summaryValue}>{groupName}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Mô tả:</span>
                      <span className={styles.summaryValue}>{description}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>ID Xe:</span>
                      <span className={styles.summaryValue}>{vehicleId}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Giá trị ước tính:</span>
                      <span className={styles.summaryValue}>
                        {parseInt(estimatedValue).toLocaleString()} VND
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Số thành viên tối đa:</span>
                      <span className={styles.summaryValue}>{maxMembers} người</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Tỷ lệ sở hữu tối thiểu:</span>
                      <span className={styles.summaryValue}>{minOwnershipPercentage}%</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setModalStep(2)}
                    disabled={submitting}
                  >
                    Quay lại
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={async () => {
                      setSubmitting(true);
                      setFormError(null);
                      try {
                        let userId: number;
                        const storedUser = localStorage.getItem('currentUser');
                        if (storedUser) {
                          const parsedUser = JSON.parse(storedUser);
                          userId = parsedUser.userId || parsedUser.id;
                        } else if (user?.id) {
                          userId = typeof user.id === 'number' ? user.id : parseInt(user.id);
                        } else {
                          setFormError("Không tìm thấy thông tin người dùng");
                          return;
                        }

                        const response = await apiService.createGroup({
                          vehicleId: parseInt(vehicleId),
                          groupName,
                          description,
                          estimatedValue: parseFloat(estimatedValue),
                          maxMembers: parseInt(maxMembers),
                          minOwnershipPercentage: parseFloat(minOwnershipPercentage)
                        }, userId);

                        const isActualSuccess = response.success && 
                          !response.message.includes("thuộc nhóm khác") &&
                          !response.message.includes("chờ duyệt") &&
                          !response.message.includes("Lỗi") &&
                          !response.message.includes("không phải chủ sở hữu");

                        if (isActualSuccess) {
                          setSuccessMessage(response.message || "Tạo nhóm thành công!");
                          setShowCreateModal(false);
                          setModalStep(1);
                          setGroupName("");
                          setDescription("");
                          setVehicleId("");
                          setEstimatedValue("");
                          setMaxMembers("");
                          setMinOwnershipPercentage("");
                          setTimeout(() => {
                            window.location.reload();
                          }, 3000);
                        } else {
                          setFormError(response.message);
                        }
                      } catch (err: any) {
                        setFormError(err.message || "Không tạo được nhóm");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                  >
                    {submitting ? "Đang tạo..." : "Tạo nhóm"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </>
  );
}


