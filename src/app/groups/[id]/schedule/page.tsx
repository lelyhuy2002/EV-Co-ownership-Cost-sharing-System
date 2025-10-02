"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import mockApi from '@/lib/mockApi';
import Header from '@/components/Header/Header';
import styles from './schedule.module.css';

type Booking = {
  id: string;
  groupId: string;
  userId: string;
  slot: { 
    date: string; 
    start: string; 
    end?: string; 
    endDate?: string;
    endTimeExpected?: string;
    notes?: string 
  };
  status: string;
  createdAt: string;
};

export default function GroupSchedulePage() {
  const params = useParams() as { id?: string };
  const groupId = params?.id ?? 'unknown';
  const router = useRouter();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTimeExpected, setEndTimeExpected] = useState('10:00');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usages, setUsages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [barsReady, setBarsReady] = useState(false);
  const [newUserId, setNewUserId] = useState<string>('');

  const currentUserId = useMemo(() => {
    if (typeof window === 'undefined') return 'user-002';
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null')?.id ?? 'user-002'; } catch { return 'user-002'; }
  }, []);

  useEffect(() => {
    (async () => {
      const [b, u, m] = await Promise.all([
        mockApi.getBookingsForGroup(groupId),
        mockApi.getUsageHistory({ groupId }),
        mockApi.getGroupMembers(groupId)
      ]);
      setBookings(b || []);
      setUsages(u || []);
      setMembers(m || []);
      // reset/animate bars after data loads
      setBarsReady(false);
      setTimeout(() => setBarsReady(true), 240);
    })();
  }, [groupId]);

  const exportCSV = async () => {
    const rows = await mockApi.getUsageHistory({ groupId });
    const csv = ['id,bookingId,ts,distanceKm,durationMin,cost'].concat(rows.map((r:any)=>`${r.id},${r.bookingId},${r.ts},${r.usage.distanceKm||''},${r.usage.durationMin||''},${r.usage.cost||''}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `usage_${groupId}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const weekDays = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, []);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const d of weekDays) map[d] = [];
    bookings.forEach(b => {
      if (!map[b.slot.date]) map[b.slot.date] = [];
      map[b.slot.date].push(b);
    });
    return map;
  }, [bookings, weekDays]);

  const getMember = (id: string) => members.find(m => m.id === id) || { id, name: id, percent: 0, color: '#9ca3af' };

  // Tính toán số ngày tối đa được đặt dựa trên % sở hữu
  const getMaxBookingDays = (ownershipPercent: number) => {
    // Công thức: % sở hữu * 30 ngày (tối đa 1 tháng)
    // Tối thiểu 1 ngày, tối đa 30 ngày
    return Math.max(1, Math.min(30, Math.round(ownershipPercent * 0.3)));
  };

  const toMinutes = (t: string) => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };

  const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return Math.max(toMinutes(aStart), toMinutes(bStart)) < Math.min(toMinutes(aEnd), toMinutes(bEnd));
  };

  const handleCreateBooking = async () => {
    setMessage(null);
    if (!date) { setMessage('Vui lòng chọn ngày bắt đầu.'); return; }
    if (!endDate) { setMessage('Vui lòng chọn ngày kết thúc dự kiến.'); return; }
    if (!endTime) { setMessage('Vui lòng chọn giờ kết thúc.'); return; }
    if (!endTimeExpected) { setMessage('Vui lòng chọn giờ kết thúc dự kiến.'); return; }
    
    // Kiểm tra ngày bắt đầu không được trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(date);
    if (startDate < today) {
      setMessage('Ngày bắt đầu không được trong quá khứ.');
      return;
    }
    
    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    const endDateObj = new Date(endDate);
    if (endDateObj < startDate) {
      setMessage('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }
    
    // Kiểm tra số ngày đặt không vượt quá giới hạn
    const bookingUserId = newUserId || currentUserId;
    const currentMember = members.find(m => m.id === bookingUserId) || { percent: 0 };
    const maxDays = getMaxBookingDays(currentMember.percent);
    const daysDiff = Math.ceil((endDateObj.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff > maxDays) {
      setMessage(`Bạn chỉ được đặt tối đa ${maxDays} ngày (dựa trên ${currentMember.percent}% sở hữu).`);
      return;
    }
    // AI priority check animation
    setAiChecking(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      // run conflict logic
      const existing = await mockApi.getBookingsForGroup(groupId);
      const overlap = existing.find((b: any) => b.slot.date === date && b.status === 'confirmed' && b.slot.start && b.slot.end && timesOverlap(startTime, endTime, b.slot.start, b.slot.end));
      if (overlap) {
        const membersList: any[] = await mockApi.getGroupMembers(groupId);
        const bookingUserId = newUserId || currentUserId;
        const currentMember = membersList.find((m:any) => m.id === bookingUserId) || { percent: 0 };
        const ownerOfConflict = membersList.find((m:any) => m.id === overlap.userId) || { percent: 0 };
        if (currentMember.percent > ownerOfConflict.percent) {
          const newBooking = await mockApi.replaceBooking(overlap.id, { groupId, userId: bookingUserId, slot: { date, start: startTime, end: endTime } });
          setBookings(prev => prev.map(bk => bk.id === overlap.id ? { ...bk, status: 'bumped' } : bk).concat(newBooking));
          setMessage(`Xung đột: ${overlap.userId} đã đặt trước nhưng ưu tiên được áp dụng do tỷ lệ sở hữu cao hơn.`);
        } else {
          setMessage('Xung đột lịch: thời gian này đã có người đặt. Vui lòng chọn thời gian khác.');
        }
        return;
      }
      // small extra wait to make the AI-check feel real
      await new Promise(r => setTimeout(r, 550));
  const bookingUserId = newUserId || currentUserId;
  const booking = await mockApi.createBooking(groupId, bookingUserId, { 
    date, 
    start: startTime, 
    end: endTime,
    endDate: endDate,
    endTimeExpected: endTimeExpected
  });
      setBookings(prev => [...prev, booking as Booking]);
      setDate(''); setStartTime('09:00'); setEndTime('10:00'); setEndDate(''); setEndTimeExpected('10:00');
      setPanelOpen(false);
      setMessage('Đặt thành công.');
    } catch (err) {
      console.error(err);
      setMessage('Lỗi khi đặt lịch.');
    } finally {
      setAiChecking(false);
    }
  };


  // Personal analysis: compute user's total duration vs group total (simple aggregation)
  const personalAnalysis = useMemo(() => {
    const userUsages = usages.filter(u => {
      const b = bookings.find((bb:any) => bb.id === u.bookingId);
      return b && b.userId === currentUserId;
    });
    const userMinutes = userUsages.reduce((s, u) => s + (u.usage.durationMin || 0), 0);
    const totalMinutes = usages.reduce((s, u) => s + (u.usage.durationMin || 0), 0) || 1;
    const pct = Math.round((userMinutes / totalMinutes) * 100);
    const myPercent = (members.find(m => m.id === currentUserId)?.percent) || 0;
    return { userMinutes, totalMinutes, pct, myPercent };
  }, [usages, bookings, members, currentUserId]);

  return (
    <>
      <Header headerHidden={false} currentSection={2} goToSection={() => {}} />
      <main className={styles.container}>
        <div className={styles.mainArea}>
          <h1 className={styles.title}>Lịch nhóm — {groupId}</h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div className={styles.memberLegend}>
            {members.map(m => (
              <div key={m.id} className={styles.legendItem}>
                <div className={styles.legendSwatch} style={{ background: m.color }} />
                <div className={styles.memberName}>{m.name} <span style={{ fontWeight: 600, marginLeft: 6 }}>({m.percent}%)</span></div>
              </div>
            ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={styles.exportBtn} onClick={() => exportCSV()}>Export CSV</button>
              <button className={styles.primaryBtn} onClick={() => setPanelOpen(true)}>Đặt Lịch Mới</button>
            </div>
          </div>

          <div className={styles.weekGrid}>
            {weekDays.map(d => (
              <div key={d} className={styles.dayColumn}>
                <div className={styles.dayHeader}>{new Date(d).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}</div>
                <div className={styles.dayBody}>
                  {(bookingsByDate[d] || []).map(b => {
                    const mem = getMember(b.userId);
                    const statusClass = b.status === 'in-use' ? styles.statusInUse : (b.status === 'bumped' ? styles.statusBumped : styles.statusConfirmed);
                    const bgClass = b.status === 'in-use' ? 'bookingInUseBg' : 'bookingConfirmedBg';
                    return (
                      <div id={'booking-' + b.id} key={b.id} className={styles.bookingCard + ' ' + styles[bgClass]} style={{ borderLeft: `6px solid ${mem.color || '#6b7280'}`, position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className={styles.bookingTop}>
                            <div className={styles.bookingTime}>
                              {b.slot.start}{b.slot.end ? ` - ${b.slot.end}` : ''}
                              {b.slot.endDate && (
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                  Đến: {new Date(b.slot.endDate).toLocaleDateString('vi-VN')} {b.slot.endTimeExpected}
                                </div>
                              )}
                            </div>
                            <div className={`${styles.bookingStatus} ${statusClass}`}>{b.status}</div>
                          </div>
                          <div className={styles.bookingUser} style={{ color: mem.color }}>{mem.name}</div>
                        </div>

                        <div className={styles.bookingTooltip} style={{ right: 12 }}>
                          Người đặt: {mem.name} ({mem.percent}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <section className={styles.usageSection}>
            <h2>Lịch sử sử dụng</h2>
            <table className={styles.usageTable}>
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Ngày</th>
                  <th>Quãng đường</th>
                  <th>Thời lượng</th>
                  <th>Chi phí</th>
                  <th>Trạng thái thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {usages.map(u => {
                  const booking = bookings.find((b:any) => b.id === u.bookingId) as Booking | undefined;
                  const owner = booking ? getMember(booking.userId) : { name: u.usage.recordedBy || 'Unknown' };
                  return (
                    <tr key={u.id}>
                      <td>{owner.name}</td>
                      <td>{new Date(u.ts).toLocaleString()}</td>
                      <td>{u.usage.distanceKm ?? '—'} km</td>
                      <td>{u.usage.durationMin ?? '—'} min</td>
                      <td>{u.usage.cost ? `${u.usage.cost.toLocaleString()}đ` : '—'}</td>
                      <td>{u.usage.paid ? 'Paid' : 'Unpaid'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Đặt xe</h3>
            <div className={styles.field}>
              <label>Ngày bắt đầu</label>
              <input 
                className={styles.input} 
                type="date" 
                value={date} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} 
              />
            </div>
            <div className={styles.field}>
              <label>Giờ bắt đầu</label>
              <input className={styles.input} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Ngày kết thúc dự kiến</label>
              <input 
                className={styles.input} 
                type="date" 
                value={endDate} 
                min={date || new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
            <div className={styles.field}>
              <label>Giờ kết thúc dự kiến</label>
              <input className={styles.input} type="time" value={endTimeExpected} onChange={e => setEndTimeExpected(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Giờ kết thúc thực tế</label>
              <input className={styles.input} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
            <div className={styles.field}>
              <small className={styles.note}>
                Lưu ý: Quyền ưu tiên có thể áp dụng dựa trên tỷ lệ sở hữu của bạn. 
                Số ngày tối đa được đặt: {getMaxBookingDays((members.find(m => m.id === currentUserId)?.percent) || 0)} ngày.
              </small>
            </div>
            <button className={styles.primaryBtn} onClick={handleCreateBooking}>Đặt ngay</button>
            {message && <div className={styles.message}>{message}</div>}
            <div style={{ marginTop: 12 }}>
              <button className={styles.exportBtn} onClick={async () => {
                const rows = await mockApi.getUsageHistory({ groupId });
                const csv = ['id,bookingId,ts,distanceKm,durationMin,cost'].concat(rows.map((r:any)=>`${r.id},${r.bookingId},${r.ts},${r.usage.distanceKm||''},${r.usage.durationMin||''},${r.usage.cost||''}`)).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `usage_${groupId}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}>Export usage (.csv)</button>
            </div>
          </div>


          <div className={styles.card}>
            <h3>Thành viên & Tỷ lệ</h3>
            <div className={styles.memberListSidebar}>
              {members.map(m => (
                <div key={m.id} className={styles.memberRowSidebar}>
                  <div className={styles.avatarSmall} style={{ background: m.color }}>{m.name[0]}</div>
                  <div>
                    <div className={styles.memberName}>{m.name}</div>
                    <div className={styles.memberPct}>{m.percent}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.card}>
              <h4>Phân tích cá nhân — so sánh</h4>
              <div className={styles.chartContainer}>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Sở hữu (%)</div>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barsReady ? `${personalAnalysis.myPercent}%` : '0%', background: '#94a3ff' }} /></div>
                </div>
                <div className={styles.barRow}>
                  <div className={styles.barLabel}>Thời gian sử dụng (%)</div>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: barsReady ? `${personalAnalysis.pct}%` : '0%', background: '#60a5fa' }} /></div>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>Tổng thời gian bạn: {personalAnalysis.userMinutes} phút — Nhóm tổng: {personalAnalysis.totalMinutes} phút</div>
              </div>
            </div>
          </div>
        </aside>
      </main>

        {/* Slide-in panel for booking creation */}
        <div className={`${styles.slidePanel} ${panelOpen ? styles.openPanel : ''}`} aria-hidden={!panelOpen}>
          <div className={styles.panelContent}>
            <h3>Đặt Lịch Mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label>Ngày bắt đầu</label>
              <input 
                className={styles.input} 
                type="date" 
                value={date} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} 
              />
              <label>Giờ bắt đầu</label>
              <input className={styles.input} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              <label>Ngày kết thúc dự kiến</label>
              <input 
                className={styles.input} 
                type="date" 
                value={endDate} 
                min={date || new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)} 
              />
              <label>Giờ kết thúc dự kiến</label>
              <input className={styles.input} type="time" value={endTimeExpected} onChange={e => setEndTimeExpected(e.target.value)} />
              <label>Giờ kết thúc thực tế</label>
              <input className={styles.input} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              <label>Người dùng</label>
              <select className={styles.input} value={newUserId} onChange={e => setNewUserId(e.target.value)}>
                <option value="">(Bạn)</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Số ngày tối đa được đặt: {getMaxBookingDays((members.find(m => m.id === (newUserId || currentUserId))?.percent) || 0)} ngày
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.primaryBtn} onClick={handleCreateBooking} disabled={aiChecking}>
                  {aiChecking ? <span className={styles.spinner}><span className={styles.spinnerDot}></span></span> : 'Xác nhận'}
                </button>
                <button className={styles.secondaryBtn} onClick={() => setPanelOpen(false)}>Hủy</button>
              </div>
              {aiChecking && <div style={{ color: 'var(--muted)' }}>AI đang kiểm tra quyền ưu tiên...</div>}
            </div>
          </div>
        </div>

    </>
  );
}
