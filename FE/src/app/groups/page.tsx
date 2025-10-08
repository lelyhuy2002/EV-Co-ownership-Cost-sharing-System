"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import { mockApi } from '@/lib/mockApi';
import { GROUPS_TO_JOIN, MY_GROUPS, type GroupToJoin, type MyGroup } from '@/lib/groupsData';
import { useRouter } from "next/navigation";

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
          {group.status === "open" ? "🟢 Còn trống" : "🔴 Đã đầy"}
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
            <span className={styles.metaIcon}>📍</span>
            <span>{group.region}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🎯</span>
            <span>{group.purpose}</span>
          </div>
          <div className={styles.metaItemCompact}>
            <span className={styles.metaIcon}>👤</span>
            <span className={styles.adminNameCompact}>{group.adminName}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
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
  // Removed viewMode state - using list view only
  const [sortBy, setSortBy] = useState("newest");
  const [showFullGroups, setShowFullGroups] = useState(false);
  const router = useRouter();
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
        <button className={styles.primaryBtn} onClick={() => { window.location.href = '/groups/create'; }}>Tạo nhóm mới</button>
        <div className={styles.helperText}>
          Dán liên kết mời từ bạn bè hoặc nhấn &quot;Tạo nhóm mới&quot; để bắt đầu. Người tạo sẽ trở thành Admin nhóm.
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
            <button className={`${styles.tabBtn} ${activeTab === "requests" ? styles.tabActive : ""}`} onClick={() => setActiveTab("requests")}>
              <span>📝</span>
              <span>Yêu cầu tham gia</span>
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
                <span className={styles.searchIcon}>🔍</span>
              </div>
              <button 
                className={styles.aiToggle}
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              >
                <span>🤖</span>
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
                {showFullGroups ? '✅' : '☐'} Nhóm đầy
              </button>
            </div>
          </div>

          {/* AI Recommendations - Simplified */}
          {showAIRecommendations && (
            <div className={styles.aiSection}>
              <h3>🤖 Gợi ý cho bạn</h3>
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
                            <div className={styles.aiMeta}>📍 {group.region} • 💰 {group.priceRange} • ⭐ {group.rating}</div>
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

          {/* Groups List */}
          <div className={styles.groupsSection}>
            {openGroups.length > 0 && (
              <div className={styles.groupCategory}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>
                    🟢 Nhóm đang cần thành viên ({openGroups.length})
                  </h3>
                </div>
                <div className={styles.groupsList}>
                  {openGroups.map(group => (
                    <GroupListItem key={group.id} group={group} onJoin={handleJoinGroup} onViewDetails={handleViewDetails} isRequested={myRequests.some((r:any)=> r.groupId===group.id && r.status==='pending')} />
                  ))}
                </div>
              </div>
            )}

            {showFullGroups && fullGroups.length > 0 && (
              <div className={styles.groupCategory}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>
                    🔴 Nhóm đã đầy ({fullGroups.length})
                  </h3>
                </div>
                <div className={styles.groupsList}>
                  {fullGroups.map(group => (
                    <GroupListItem key={group.id} group={group} onJoin={handleJoinGroup} onViewDetails={handleViewDetails} isRequested={myRequests.some((r:any)=> r.groupId===group.id && r.status==='pending')} />
                  ))}
                </div>
              </div>
            )}

            {filteredGroupsToJoin.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>Không tìm thấy nhóm phù hợp</h3>
                <p>Hãy thử điều chỉnh bộ lọc hoặc tạo nhóm mới.</p>
                <button className={styles.createGroupBtn} onClick={() => alert('Chức năng tạo nhóm sẽ được triển khai sớm!')}>
                  Tạo nhóm mới
                </button>
              </div>
            )}
          </div>
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
                <div className={styles.emptyIcon}>📝</div>
                <h3>Chưa có yêu cầu nào</h3>
                <p>Hãy duyệt các nhóm và gửi yêu cầu tham gia.</p>
                <button className={styles.primaryBtn} onClick={() => setActiveTab("discover")}>Khám phá nhóm</button>
              </div>
            ) : (
              myRequests.map((r:any) => (
                <article key={r.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <div className={styles.groupIcon}>👥</div>
                    <div className={styles.requestInfo}>
                      <h3>Yêu cầu vào nhóm {r.groupId}</h3>
                      <div className={styles.requestMeta}>
                        <span className={`${styles.status} ${r.status === 'pending' ? '' : r.status === 'approved' ? styles.approved : styles.rejected}`}>
                          {r.status === 'pending' ? '⏳ Đang chờ duyệt' : r.status === 'approved' ? '✅ Đã chấp nhận' : '❌ Từ chối'}
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
              <div className={styles.emptyIcon}>📝</div>
              <h3>Chưa có yêu cầu tham gia nào</h3>
              <p>Hãy khám phá các nhóm có sẵn và gửi yêu cầu tham gia để bắt đầu hành trình chia sẻ xe điện.</p>
              <button className={styles.primaryBtn} onClick={() => setActiveTab("discover")}>
                Khám phá nhóm
              </button>
            </div>
          )}
        </section>
      )}
      </main>
    </>
  );
}


