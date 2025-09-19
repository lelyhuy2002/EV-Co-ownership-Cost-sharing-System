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
}

interface DiscoverGroup {
  id: string;
  name: string;
  description: string;
  availableOwnershipPct: number;
  memberCount: number;
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
}

const MY_GROUPS: MyGroup[] = [
  { id: "grp-01", name: "EV Shared Hanoi", myOwnershipPct: 25, memberCount: 4, description: "Nhóm chia sẻ VF8 cho nhu cầu đi lại hằng ngày." },
  { id: "grp-02", name: "Model 3 Weekend", myOwnershipPct: 10, memberCount: 8, description: "Cộng đồng sử dụng Tesla Model 3 cho cuối tuần." },
];

const DISCOVER_GROUPS: DiscoverGroup[] = [
  { id: "grp-11", name: "Charging Explorers", description: "Nhóm test tuyến sạc đường dài.", availableOwnershipPct: 15, memberCount: 5 },
  { id: "grp-12", name: "EcoDrive Study", description: "Nghiên cứu thói quen lái xe đô thị.", availableOwnershipPct: 30, memberCount: 3 },
  { id: "grp-13", name: "V2G Pilot", description: "Thí điểm giao dịch V2G khu vực HN.", availableOwnershipPct: 20, memberCount: 6 },
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
    status: "open"
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
    status: "open"
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
    status: "full"
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
    status: "open"
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
  const router = useRouter();

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
      
      return matchesSearch && matchesRegion && matchesVehicle && matchesStatus;
    });
  }, [searchQuery, regionFilter, vehicleFilter, statusFilter]);

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
      <div className={styles.header}>
        <div className={styles.title}>Nhóm đồng sở hữu</div>
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === "mine" ? styles.tabActive : ""}`} onClick={() => setActiveTab("mine")}>Nhóm của tôi</button>
          <button className={`${styles.tabBtn} ${activeTab === "discover" ? styles.tabActive : ""}`} onClick={() => setActiveTab("discover")}>Khám phá nhóm</button>
          <button className={`${styles.tabBtn} ${activeTab === "find" ? styles.tabActive : ""}`} onClick={() => setActiveTab("find")}>Tìm & Tham gia</button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Tìm kiếm nhóm..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {activeTab === "mine" ? (
        <section className={styles.grid}>
          {myGroups.map((g) => (
            <article key={g.id} className={styles.card}>
              <div className={styles.groupHeader}>
                <div className={styles.groupTitle}>{g.name}</div>
                <div className={styles.meta}>{g.memberCount} thành viên</div>
              </div>
              <p className={styles.groupDesc}>{g.description}</p>
              <div className={styles.progress}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${g.myOwnershipPct}%` }} />
                </div>
                <div className={styles.progressText}>Tỷ lệ sở hữu của bạn: {g.myOwnershipPct}%</div>
              </div>
              <div className={styles.actionGroups}>
                <div className={styles.actionGroup}>
                  <Link href={`/groups/${g.id}/schedule`} className={`${styles.linkBtn}`}>
                    <span>🗓️</span> <span>Đặt lịch & sử dụng xe</span>
                  </Link>
                  <Link href={`/groups/${g.id}/costs`} className={`${styles.linkBtn}`}>
                    <span>💳</span> <span>Chi phí & thanh toán</span>
                  </Link>
                </div>
                <div className={styles.actionGroup}>
                  <Link href={`/groups/${g.id}/history`} className={`${styles.linkBtn}`}>
                    <span>📈</span> <span>Lịch sử & phân tích</span>
                  </Link>
                  <Link href={`/groups/${g.id}/manage`} className={`${styles.linkBtn} ${styles.primary}`}>
                    <span>🛠️</span> <span>Quản lý nhóm</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : activeTab === "discover" ? (
        <section className={styles.grid}>
          {discoverGroups.map((g) => (
            <article key={g.id} className={styles.card}>
              <div className={styles.groupHeader}>
                <div className={styles.groupTitle}>{g.name}</div>
                <div className={styles.meta}>{g.memberCount} thành viên</div>
              </div>
              <p className={styles.groupDesc}>{g.description}</p>
              <div className={styles.progress}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFillAlt} style={{ width: `${g.availableOwnershipPct}%` }} />
                </div>
                <div className={styles.progressText}>Tỷ lệ sở hữu còn trống: {g.availableOwnershipPct}%</div>
              </div>
              <div className={styles.actionGroup}>
                <button className={styles.btn}><span>➕</span> Yêu cầu tham gia</button>
                <Link href={`/groups/${g.id}`} className={styles.linkBtn}>Tìm hiểu thêm</Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <div className={styles.searchSection}>
            <div className={styles.searchRow}>
              <input
                className={styles.searchInput}
                placeholder="Tìm kiếm theo tên xe, khu vực, mục đích sử dụng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            </div>
          </div>

          <section className={styles.groupsGrid}>
            {filteredGroupsToJoin.map(group => (
              <article key={group.id} className={styles.groupCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.vehicleName}>{group.vehicleName}</div>
                    <div className={styles.vehicleModel}>{group.vehicleModel}</div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[`status${group.status.charAt(0).toUpperCase() + group.status.slice(1)}`]}`}>
                    {group.status === "open" ? "Đang mở" : "Đã đầy"}
                  </span>
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
                    <span className={styles.detailLabel}>Khu vực:</span>
                    <span className={styles.detailValue}>{group.region}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Mục đích:</span>
                    <span className={styles.detailValue}>{group.purpose}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Admin:</span>
                    <span className={styles.detailValue}>{group.adminName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Tạo ngày:</span>
                    <span className={styles.detailValue}>{group.createdDate}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={styles.joinBtn}
                    onClick={() => alert(`Đã gửi yêu cầu tham gia nhóm ${group.id}. Admin sẽ xem xét và phản hồi.`)}
                    disabled={group.status === "full"}
                  >
                    {group.status === "full" ? "Đã đầy" : "Gửi yêu cầu tham gia"}
                  </button>
                  <button
                    className={styles.joinBtn}
                    onClick={() => router.push(`/groups/${group.id}/details`)}
                    style={{ background: "#6b7280", flex: "0 0 auto", padding: "12px 16px" }}
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


