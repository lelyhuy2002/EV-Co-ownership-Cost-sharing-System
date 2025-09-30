"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GROUPS_TO_JOIN } from "@/lib/groupsData";
import { mockApi } from "@/lib/mockApi";
import styles from "./vehicle.module.css";

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  // Reuse GROUPS_TO_JOIN item as the vehicle card source
  const vehicle = GROUPS_TO_JOIN.find(g => g.id === id);
  const images = useMemo(() => vehicle?.images ?? [], [vehicle]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showJoin, setShowJoin] = useState(false);
  const [desiredPct, setDesiredPct] = useState<number>(Math.min(20, Math.max(5, vehicle?.ownershipAvailable ?? 10)));
  const [note, setNote] = useState<string>("Tôi muốn tham gia nhóm này.");
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  // Poll join request status for current user and this group
  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return;
    const user = JSON.parse(raw);
    let alive = true;
    async function fetchReqs() {
      try {
        const all = await mockApi.getJoinRequests();
        const mine = all.filter((r:any) => r.groupId === id && r.userId === user.id);
        if (!alive) return;
        setMyRequests(mine.sort((a:any,b:any)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()));
        setRequested(mine.some((r:any)=> r.status === 'pending'));
      } catch {}
    }
    fetchReqs();
    const t = setInterval(fetchReqs, 2000);
    return () => { alive = false; clearInterval(t); };
  }, [id]);

  if (!vehicle) {
    return (
      <main className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🚘</div>
          <h2>Không tìm thấy xe</h2>
          <p>ID: {id}</p>
          <button className={styles.primaryBtn} onClick={() => router.push("/groups")}>Quay lại nhóm</button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.contentGrid}>
        <article className={styles.card}>
          <header className={styles.header}>
            <div className={styles.icon}>{vehicle.icon}</div>
            <div className={styles.titleBox}>
              <h1 className={styles.title}>{vehicle.vehicleName}</h1>
              <div className={styles.subtitle}>{vehicle.vehicleModel}</div>
            </div>
            <div className={styles.pricePill}>{vehicle.priceRange}</div>
          </header>

          {/* Gallery with main image + thumbnails */}
          {images.length ? (
            <section className={styles.gallery}>
              <div className={styles.heroImage}>
                <img src={images[activeIdx]} alt={`${vehicle.vehicleName} main`} />
              </div>
              {images.length > 1 && (
                <div className={styles.thumbRow}>
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.thumb} ${idx === activeIdx ? styles.thumbActive : ''}`}
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`Ảnh ${idx + 1}`}
                    >
                      <img src={src} alt={`${vehicle.vehicleName} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Quick facts grid */}
          <section className={styles.grid}>
            <div className={styles.infoBlock}><div className={styles.label}>Khu vực</div><div className={styles.value}>📍 {vehicle.region}</div></div>
            <div className={styles.infoBlock}><div className={styles.label}>Mục đích</div><div className={styles.value}>🎯 {vehicle.purpose}</div></div>
            <div className={styles.infoBlock}><div className={styles.label}>Đánh giá</div><div className={styles.value}>⭐ {vehicle.rating} ({vehicle.reviewCount})</div></div>
            <div className={styles.infoBlock}><div className={styles.label}>Trạng thái</div><div className={styles.value}>{vehicle.status === 'open' ? '🟢 Nhận thành viên' : '🔴 Đã đầy'}</div></div>
            <div className={styles.infoBlock}><div className={styles.label}>Thành viên</div><div className={styles.value}>{vehicle.currentMembers}/{vehicle.maxMembers}</div></div>
            <div className={styles.infoBlock}><div className={styles.label}>Sở hữu còn lại</div><div className={styles.value}>{vehicle.ownershipAvailable}%</div></div>
          </section>

          {/* Specs */}
          {vehicle.specs && (
            <section className={styles.specs}>
              <h2 className={styles.sectionTitle}>Thông số nổi bật</h2>
              <div className={styles.specsGrid}>
                {vehicle.specs.rangeKm !== undefined && (<div className={styles.specItem}><span>Tầm hoạt động</span><strong>{vehicle.specs.rangeKm} km</strong></div>)}
                {vehicle.specs.batteryKWh !== undefined && (<div className={styles.specItem}><span>Pin</span><strong>{vehicle.specs.batteryKWh} kWh</strong></div>)}
                {vehicle.specs.chargeType && (<div className={styles.specItem}><span>Sạc</span><strong>{vehicle.specs.chargeType}</strong></div>)}
                {vehicle.specs.seats !== undefined && (<div className={styles.specItem}><span>Chỗ ngồi</span><strong>{vehicle.specs.seats}</strong></div>)}
                {vehicle.specs.drivetrain && (<div className={styles.specItem}><span>Hệ dẫn động</span><strong>{vehicle.specs.drivetrain}</strong></div>)}
                {vehicle.specs.color && (<div className={styles.specItem}><span>Màu</span><strong>{vehicle.specs.color}</strong></div>)}
                {vehicle.specs.warrantyYears !== undefined && (<div className={styles.specItem}><span>Bảo hành</span><strong>{vehicle.specs.warrantyYears} năm</strong></div>)}
              </div>
            </section>
          )}

          {/* My Requests */}
          <section className={styles.requests}>
            <h2 className={styles.sectionTitle}>Yêu cầu của tôi</h2>
            {myRequests.length === 0 ? (
              <div className={styles.emptySmall}>Chưa có yêu cầu nào cho xe này.</div>
            ) : (
              <div className={styles.requestList}>
                {myRequests.map((r:any) => (
                  <div key={r.id} className={styles.requestItem}>
                    <div className={styles.reqLeft}>
                      <div className={styles.reqMeta}>Gửi lúc {new Date(r.createdAt).toLocaleString('vi-VN')}</div>
                      {r.message && <div className={styles.reqMsg}>{r.message}</div>}
                    </div>
                    <div className={styles.reqRight}>
                      <span className={`${styles.statusChip} ${r.status === 'pending' ? styles.statusPending : r.status === 'approved' ? styles.statusApproved : styles.statusRejected}`}>
                        {r.status === 'pending' ? '⏳ Chờ duyệt' : r.status === 'approved' ? '✅ Đã chấp nhận' : '❌ Từ chối'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </article>

        {/* Sticky summary / CTA */}
        <aside className={styles.stickyAside} aria-label="Tóm tắt & hành động">
          <div className={styles.asideCard}>
            <div className={styles.asideHeader}>
              <span className={styles.asidePrice}>{vehicle.priceRange}</span>
              <span className={`${styles.badge} ${requested ? styles.badgePending : (vehicle.status === 'open' ? styles.badgeOpen : styles.badgeFull)}`}>{requested ? 'Đã gửi yêu cầu' : (vehicle.status === 'open' ? 'Còn chỗ' : 'Đã đầy')}</span>
            </div>
            <div className={styles.asideStats}>
              <div><span className={styles.statLabel}>Thành viên</span><strong>{vehicle.currentMembers}/{vehicle.maxMembers}</strong></div>
              <div><span className={styles.statLabel}>Còn lại</span><strong>{vehicle.ownershipAvailable}%</strong></div>
              <div><span className={styles.statLabel}>Đánh giá</span><strong>{vehicle.rating}⭐</strong></div>
            </div>
            <div className={styles.asideActions}>
              <button className={`${styles.button} ${styles.primary}`} onClick={() => setShowJoin(true)} disabled={requested || vehicle.status !== 'open'}>{requested ? 'Đã gửi yêu cầu' : 'Tham gia ngay'}</button>
              <Link href="/groups" className={`${styles.button} ${styles.outline}`}>Xem nhóm</Link>
            </div>
          </div>
        </aside>
      </div>

      {showJoin && (
        <div className={styles.modalOverlay} role="dialog" aria-modal>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận tham gia</h3>
              <button className={styles.closeBtn} onClick={() => setShowJoin(false)} aria-label="Đóng">×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.confirmRow}><span>Xe</span><strong>{vehicle.vehicleName} — {vehicle.vehicleModel}</strong></div>
              <div className={styles.confirmRow}><span>Khu vực</span><strong>{vehicle.region}</strong></div>
              <div className={styles.confirmRow}><span>Giá ước tính</span><strong>{vehicle.priceRange}</strong></div>
              <div className={styles.divider} />
              <div className={styles.fieldBlock}>
                <label className={styles.label}>Tỷ lệ sở hữu mong muốn</label>
                <div className={styles.pctRow}>
                  <input type="range" min={1} max={Math.max(1, vehicle.ownershipAvailable)} value={desiredPct} onChange={e => setDesiredPct(parseInt(e.target.value))} />
                  <input className={styles.pctInput} type="number" min={1} max={vehicle.ownershipAvailable} value={desiredPct} onChange={e => setDesiredPct(Math.min(vehicle.ownershipAvailable, Math.max(1, parseInt(e.target.value || '0'))))} />
                  <span>%</span>
                </div>
                <div className={styles.helpText}>Còn lại: {vehicle.ownershipAvailable}%</div>
              </div>
              <div className={styles.fieldBlock}>
                <label className={styles.label}>Lời nhắn tới Admin</label>
                <textarea className={styles.noteInput} rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Giới thiệu ngắn gọn và mục đích tham gia" />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.button} ${styles.outline}`} onClick={() => setShowJoin(false)}>Hủy</button>
              <button className={`${styles.button} ${styles.primary}`} disabled={submitting} onClick={async () => {
                setSubmitting(true);
                try {
                  const raw = localStorage.getItem('currentUser');
                  if (!raw) { alert('Vui lòng đăng ký/đăng nhập trước (demo)'); setSubmitting(false); return; }
                  const user = JSON.parse(raw);
                  const message = `${note} | Tỷ lệ mong muốn: ${desiredPct}%`;
                  await mockApi.requestJoin(id, user.id, user.fullName || user.username, message);
                  setRequested(true);
                  setShowJoin(false);
                  alert('Đã gửi yêu cầu tham gia. Vui lòng chờ admin duyệt.');
                } catch (e) {
                  console.error(e);
                  alert('Không thể gửi yêu cầu, thử lại sau');
                } finally {
                  setSubmitting(false);
                }
              }}>{submitting ? 'Đang gửi...' : 'Xác nhận'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


